export const SESSION_COOKIE = 'session'
export const STATE_COOKIE = 'oidc_state'
export const RETURN_TO_COOKIE = 'oidc_return_to'

/** Login round-trips should complete well within this window. */
export const TRANSIENT_COOKIE_TTL_SECONDS = 600

// Cookie attributes (HttpOnly, SameSite=Lax, Path=/, Secure per config) come
// from Elysia's `cookie` config on the route plugin, not from a helper — see
// auth.routes.ts / auth-compat.routes.ts. Only maxAge is set per call site.
