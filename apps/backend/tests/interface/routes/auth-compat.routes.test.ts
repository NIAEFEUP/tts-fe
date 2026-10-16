import { describe, expect, it } from 'bun:test'
import type { AuthUser } from '@/core/auth/user'
import type { AuthConfig } from '@/core/config/auth'
import type { DevAuthenticator } from '@/domain/ports/dev-authenticator'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import { authCompatRoutes } from '@/interface/routes/auth/auth-compat.routes'

const USER: AuthUser = { id: 'up202012345', name: 'Ana Silva', email: null, role: 'USER' }

function config(overrides: Partial<AuthConfig> = {}): AuthConfig {
  return {
    oidcConfigured: true,
    clientId: 'client',
    clientSecret: 'secret',
    redirectUri: 'http://localhost:3000/v1/auth/callback',
    authorizeEndpoint: 'https://idp.test/authorize',
    tokenEndpoint: 'https://idp.test/token',
    userinfoEndpoint: 'https://idp.test/userinfo',
    scopes: 'openid',
    sessionTtlSeconds: 3600,
    frontendUrl: 'http://localhost:3100',
    allowedOrigins: ['http://localhost:3100'],
    secureCookies: false,
    devLoginEnabled: false,
    publicApiPrefix: '',
    devAccount: { username: '', password: '' },
    ...overrides,
  }
}

function buildApp(overrides: Partial<AuthConfig> = {}) {
  const users: UserRepository = {
    upsertFromClaims: async () => USER,
    findById: async () => USER,
  }
  const sessions: SessionRepository = {
    issue: async () => 'tok-1',
    resolve: async (token) => (token === 'tok-1' ? USER : null),
    revoke: async () => {},
  }
  const sigarraDirect: DevAuthenticator = { authenticate: async () => ({ name: 'Ana Silva' }) }

  return authCompatRoutes({ users, sessions, sigarraDirect, config: config(overrides) })
}

describe('auth compat routes', () => {
  it('aliases the legacy login link to the canonical route', async () => {
    const app = buildApp()
    const res = await app.handle(
      new Request('http://localhost/oidc-auth/authenticate/?return_to=http://localhost:3100/x'),
    )

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe(
      'http://localhost/api/v1/auth/login?return_to=http%3A%2F%2Flocalhost%3A3100%2Fx',
    )
  })

  it('keeps the https scheme when behind a TLS proxy', async () => {
    const app = buildApp()
    const res = await app.handle(
      new Request('http://tts-dev.niaefeup.pt/oidc-auth/authenticate/', {
        headers: { 'x-forwarded-proto': 'https' },
      }),
    )

    expect(res.headers.get('location')).toBe('https://tts-dev.niaefeup.pt/api/v1/auth/login')
  })

  it('returns the legacy session shape at /auth/info/', async () => {
    const app = buildApp()
    const res = await app.handle(new Request('http://localhost/auth/info/', { headers: { cookie: 'session=tok-1' } }))

    expect(await res.json()).toEqual({
      signed: true,
      username: USER.id,
      name: USER.name,
      eligible_exchange: false,
      is_admin: false,
    })
  })

  it('reports anonymous at /auth/info/ without a session', async () => {
    const app = buildApp()
    const res = await app.handle(new Request('http://localhost/auth/info/'))

    expect(await res.json()).toEqual({ signed: false })
  })

  it('hides /sigarra_login/ unless enabled', async () => {
    const app = buildApp()
    const res = await app.handle(
      new Request('http://localhost/sigarra_login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'up1', password: 'pw' }),
      }),
    )

    expect(res.status).toBe(404)
  })

  it('issues a session through /sigarra_login/ when enabled', async () => {
    const app = buildApp({ devLoginEnabled: true })
    const res = await app.handle(
      new Request('http://localhost/sigarra_login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'up1', password: 'pw' }),
      }),
    )

    expect(res.status).toBe(200)
    expect(res.headers.getSetCookie().some((c) => c.startsWith('session='))).toBe(true)
  })
})
