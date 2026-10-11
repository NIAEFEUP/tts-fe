import { Elysia, t } from 'elysia'
import { createGetCurrentUser } from '@/application/use-cases/auth/get-current-user'
import { createLogout } from '@/application/use-cases/auth/logout'
import type { AuthConfig } from '@/core/config/auth'
import type { DevAuthenticator } from '@/domain/ports/dev-authenticator'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import { isAdmin } from '@/core/auth/user'
import { ErrorCode } from '@/interface/errors/errors'
import { createAuthMiddleware } from '@/interface/middleware/auth.middleware'
import { applyCookiePreferences } from './auth.utils'

export type AuthCompatDeps = {
  users: UserRepository
  sessions: SessionRepository
  sigarraDirect: DevAuthenticator
  config: AuthConfig
}

/**
 * Compatibility shims for the un-migrated frontend, mounted at the root (the FE
 * builds its URLs from `BACKEND_URL` with an empty path prefix). Drop these once
 * the frontend points at `/api/v1/auth/*`.
 *
 *   GET  /oidc-auth/authenticate/ — legacy login link → /api/v1/auth/login
 *   POST /oidc-auth/logout/       — legacy logout (ignores the CSRF header)
 *   GET  /auth/info/              — legacy session info shape
 *   POST /sigarra_login/          — dev-only direct login (env-gated)
 */
export const authCompatRoutes = ({ users, sessions, sigarraDirect, config }: AuthCompatDeps) => {
  const getCurrentUser = createGetCurrentUser({ sessions })
  const logout = createLogout({ sessions })

  return new Elysia()
    .use(createAuthMiddleware({ resolveSession: sessions.resolve }))
    .get(
      '/oidc-auth/authenticate/',
      ({ query, redirect, request, headers }) => {
        // Undici (the Node adapter) rejects relative redirects, so build an
        // absolute URL. Behind the dev TLS proxy the backend speaks plain HTTP,
        // so honour X-Forwarded-Proto to keep the public scheme https.
        const target = new URL('/api/v1/auth/login', request.url)
        const forwardedProto = headers['x-forwarded-proto']?.split(',')[0]?.trim()
        if (forwardedProto) target.protocol = `${forwardedProto}:`
        if (query.return_to) target.searchParams.set('return_to', query.return_to)
        return redirect(target.toString(), 302)
      },
      {
        query: t.Object({ return_to: t.Optional(t.String()) }),
      },
    )
    .post('/oidc-auth/logout/', async ({ cookie }) => {
      await logout(cookie.session.value as string | undefined)
      cookie.session.remove()
      return { signed: false as const }
    })
    .get('/auth/info/', async ({ cookie }) => {
      const current = await getCurrentUser(cookie.session.value as string | undefined)
      if (!current) return { signed: false as const }

      return {
        signed: true as const,
        username: current.id,
        name: current.name,
        // Exchange eligibility is not implemented on the new backend yet; the
        // frontend uses this flag to gate the exchange UI, so stay false until
        // the eligibility endpoint lands.
        eligible_exchange: false,
        is_admin: isAdmin(current),
      }
    })
    .post(
      '/sigarra_login/',
      async ({ body, cookie, status }) => {
        if (!config.devLoginEnabled) {
          return status(404, { error: 'Not found', code: ErrorCode.notFound })
        }

        const { username, password } = body
        const valid = await sigarraDirect.verify(username, password)
        if (!valid) {
          return status(401, { error: 'Invalid Sigarra credentials', code: 'invalid-credentials' })
        }

        const user = await users.upsertFromClaims({
          nmec: username,
          name: 'Student',
          email: `${username}@fe.up.pt`,
        })
        const token = await sessions.issue(user.id, config.sessionTtlSeconds * 1000)

        cookie.session.value = token
        applyCookiePreferences(cookie.session, config, config.sessionTtlSeconds)

        return { message: 'Login successful', user }
      },
      {
        body: t.Object({ username: t.String(), password: t.String() }),
      },
    )
}
