import type { AuthConfig } from '@/core/config/auth'

export const SESSION_COOKIE = 'session'
export const STATE_COOKIE = 'oidc_state'
export const NONCE_COOKIE = 'oidc_nonce'
export const RETURN_TO_COOKIE = 'oidc_return_to'

/** Login round-trips should complete well within this window. */
export const TRANSIENT_COOKIE_TTL_SECONDS = 600

/** Structural type for Elysia's cookie objects, without importing the generic. */
export type MutableCookie = {
  value?: unknown
  httpOnly?: boolean
  sameSite?: boolean | 'lax' | 'strict' | 'none'
  secure?: boolean
  path?: string
  maxAge?: number
  remove(): void
}

export function applyCookiePreferences(cookie: MutableCookie, config: AuthConfig, maxAgeSeconds: number): void {
  cookie.httpOnly = true
  cookie.sameSite = 'lax'
  cookie.secure = config.secureCookies
  cookie.path = '/'
  cookie.maxAge = maxAgeSeconds
}
