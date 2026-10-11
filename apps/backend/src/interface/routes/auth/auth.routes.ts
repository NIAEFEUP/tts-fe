import { Elysia, t } from 'elysia'
import { createBeginLogin } from '@/application/use-cases/auth/begin-login'
import { createCompleteLogin, InvalidOidcStateError } from '@/application/use-cases/auth/complete-login'
import { createLogout } from '@/application/use-cases/auth/logout'
import type { AuthConfig } from '@/core/config/auth'
import type { IdentityProvider } from '@/domain/ports/identity-provider'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import { isAdmin } from '@/core/auth/user'
import { createAuthMiddleware } from '@/interface/middleware/auth.middleware'
import {
  applyCookiePreferences,
  NONCE_COOKIE,
  RETURN_TO_COOKIE,
  STATE_COOKIE,
  TRANSIENT_COOKIE_TTL_SECONDS,
} from './auth.utils'

const OIDC_NOT_CONFIGURED = {
  error: 'Sigarra OIDC is not configured on this server',
  code: 'oidc-not-configured',
}

export type AuthRoutesDeps = {
  provider: IdentityProvider
  users: UserRepository
  sessions: SessionRepository
  config: AuthConfig
}

/**
 * Canonical auth routes, mounted under `/api/v1/auth`:
 *   GET  /login     — redirect to Sigarra
 *   GET  /callback  — Sigarra redirects back; set the session cookie
 *   POST /logout    — clear the session
 *   GET  /me        — current user (or `{ signed: false }`)
 */
export const authRoutes = ({ provider, users, sessions, config }: AuthRoutesDeps) => {
  const beginLogin = createBeginLogin({ provider, frontendUrl: config.frontendUrl })
  const completeLogin = createCompleteLogin({
    provider,
    users,
    sessions,
    sessionTtlMs: config.sessionTtlSeconds * 1000,
    frontendUrl: config.frontendUrl,
  })
  const logout = createLogout({ sessions })

  return new Elysia({ prefix: '/api/v1/auth' })
    .use(createAuthMiddleware({ resolveSession: sessions.resolve }))
    .get(
      '/login',
      ({ query, cookie, redirect, status }) => {
        if (!config.oidcConfigured) return status(503, OIDC_NOT_CONFIGURED)

        const { url, state, nonce, returnTo } = beginLogin(query.return_to)

        cookie[STATE_COOKIE].value = state
        applyCookiePreferences(cookie[STATE_COOKIE], config, TRANSIENT_COOKIE_TTL_SECONDS)
        cookie[NONCE_COOKIE].value = nonce
        applyCookiePreferences(cookie[NONCE_COOKIE], config, TRANSIENT_COOKIE_TTL_SECONDS)
        cookie[RETURN_TO_COOKIE].value = returnTo
        applyCookiePreferences(cookie[RETURN_TO_COOKIE], config, TRANSIENT_COOKIE_TTL_SECONDS)

        return redirect(url, 302)
      },
      {
        query: t.Object({ return_to: t.Optional(t.String()) }),
      },
    )
    .get(
      '/callback',
      async ({ query, cookie, redirect, status }) => {
        if (!config.oidcConfigured) return status(503, OIDC_NOT_CONFIGURED)

        const clearTransient = () => {
          cookie[STATE_COOKIE].remove()
          cookie[NONCE_COOKIE].remove()
          cookie[RETURN_TO_COOKIE].remove()
        }

        if (query.error) {
          clearTransient()
          return status(401, {
            error: query.error_description ?? query.error,
            code: 'oidc-auth-error',
          })
        }

        if (!query.code) {
          return status(400, { error: 'Missing authorization code', code: 'oidc-missing-code' })
        }

        try {
          const { token, redirectTo } = await completeLogin({
            code: query.code,
            state: query.state ?? '',
            expectedState: cookie[STATE_COOKIE].value as string | undefined,
            returnTo: cookie[RETURN_TO_COOKIE].value as string | undefined,
          })

          clearTransient()
          cookie.session.value = token
          applyCookiePreferences(cookie.session, config, config.sessionTtlSeconds)

          return redirect(redirectTo, 302)
        } catch (error) {
          clearTransient()
          if (error instanceof InvalidOidcStateError) {
            return status(400, { error: 'Invalid OIDC state', code: 'oidc-state-mismatch' })
          }
          console.error('Sigarra OIDC callback failed:', error)
          return status(502, {
            error: 'Failed to complete Sigarra login',
            code: 'oidc-callback-failed',
          })
        }
      },
      {
        query: t.Object({
          code: t.Optional(t.String()),
          state: t.Optional(t.String()),
          error: t.Optional(t.String()),
          error_description: t.Optional(t.String()),
        }),
      },
    )
    .get('/me', ({ user }) => {
      if (!user) return { signed: false as const }
      return {
        signed: true as const,
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: isAdmin(user),
      }
    })
    .post('/logout', async ({ cookie }) => {
      await logout(cookie.session.value as string | undefined)
      cookie.session.remove()
      return { signed: false as const }
    })
}
