import { describe, expect, it } from 'bun:test'
import type { AuthConfig } from '@/core/config/auth'
import type { AuthUser } from '@/core/auth/user'
import type { IdentityProvider } from '@/domain/ports/identity-provider'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import { authRoutes } from './auth.routes'

const USER: AuthUser = {
  id: 'up202012345',
  name: 'Ana Silva',
  email: 'up202012345@up.pt',
  role: 'ADMIN',
}

function testConfig(overrides: Partial<AuthConfig> = {}): AuthConfig {
  return {
    oidcConfigured: true,
    clientId: 'client',
    clientSecret: 'secret',
    redirectUri: 'http://localhost:3000/api/v1/auth/callback',
    authorizeEndpoint: 'https://idp.test/authorize',
    tokenEndpoint: 'https://idp.test/token',
    userinfoEndpoint: 'https://idp.test/userinfo',
    scopes: 'openid',
    sessionTtlSeconds: 3600,
    frontendUrl: 'http://localhost:3100',
    allowedOrigins: ['http://localhost:3100'],
    secureCookies: false,
    devLoginEnabled: false,
    ...overrides,
  }
}

function buildApp(config = testConfig()) {
  const tokens = new Map<string, AuthUser>()

  const provider: IdentityProvider = {
    authorizationUrl: ({ state, nonce }) => `https://idp.test/authorize?state=${state}&nonce=${nonce}`,
    exchangeCodeForUser: async () => ({
      nmec: USER.id,
      name: USER.name,
      email: USER.email,
    }),
  }

  const users: UserRepository = {
    upsertFromClaims: async () => USER,
    findById: async (id) => (id === USER.id ? USER : null),
  }

  const sessions: SessionRepository = {
    issue: async () => {
      const token = `tok-${tokens.size + 1}`
      tokens.set(token, USER)
      return token
    },
    resolve: async (token) => tokens.get(token) ?? null,
    revoke: async (token) => {
      tokens.delete(token)
    },
  }

  return authRoutes({ provider, users, sessions, config })
}

function cookieValue(response: Response, name: string): string | null {
  const raw = response.headers.getSetCookie?.() ?? []
  for (const entry of raw) {
    const [pair] = entry.split(';')
    const [key, value] = pair.split('=')
    if (key === name) return value
  }
  return null
}

describe('auth routes', () => {
  it('redirects to the IdP and stores state', async () => {
    const app = buildApp()
    const res = await app.handle(new Request('http://localhost/api/v1/auth/login'))

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toContain('https://idp.test/authorize')
    expect(cookieValue(res, 'oidc_state')).toBeTruthy()
  })

  it('returns 503 when OIDC is not configured', async () => {
    const app = buildApp(testConfig({ oidcConfigured: false, clientId: '', clientSecret: '' }))
    const res = await app.handle(new Request('http://localhost/api/v1/auth/login'))

    expect(res.status).toBe(503)
    expect((await res.json()).code).toBe('oidc-not-configured')
  })

  it('completes the callback: sets a session cookie and redirects to the frontend', async () => {
    const app = buildApp()

    const login = await app.handle(new Request('http://localhost/api/v1/auth/login'))
    const state = cookieValue(login, 'oidc_state')

    const callback = await app.handle(
      new Request(`http://localhost/api/v1/auth/callback?code=abc&state=${state}`, {
        headers: { cookie: `oidc_state=${state}` },
      }),
    )

    expect(callback.status).toBe(302)
    expect(callback.headers.get('location')).toBe('http://localhost:3100/')
    expect(cookieValue(callback, 'session')).toBeTruthy()
  })

  it('rejects a callback with a mismatched state', async () => {
    const app = buildApp()
    const res = await app.handle(
      new Request('http://localhost/api/v1/auth/callback?code=abc&state=forged', {
        headers: { cookie: 'oidc_state=expected' },
      }),
    )

    expect(res.status).toBe(400)
    expect((await res.json()).code).toBe('oidc-state-mismatch')
  })

  it('reports anonymous on /me without a session', async () => {
    const app = buildApp()
    const res = await app.handle(new Request('http://localhost/api/v1/auth/me'))

    expect(await res.json()).toEqual({ signed: false })
  })

  it('reports the user on /me with a valid session cookie', async () => {
    const app = buildApp()

    const login = await app.handle(new Request('http://localhost/api/v1/auth/login'))
    const state = cookieValue(login, 'oidc_state')
    const callback = await app.handle(
      new Request(`http://localhost/api/v1/auth/callback?code=abc&state=${state}`, {
        headers: { cookie: `oidc_state=${state}` },
      }),
    )
    const session = cookieValue(callback, 'session')

    const me = await app.handle(
      new Request('http://localhost/api/v1/auth/me', {
        headers: { cookie: `session=${session}` },
      }),
    )

    expect(await me.json()).toEqual({
      signed: true,
      id: USER.id,
      name: USER.name,
      email: USER.email,
      isAdmin: true,
    })
  })

  it('clears the session on logout', async () => {
    const app = buildApp()
    const res = await app.handle(
      new Request('http://localhost/api/v1/auth/logout', {
        method: 'POST',
        headers: { cookie: 'session=tok-1' },
      }),
    )

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ signed: false })
  })
})
