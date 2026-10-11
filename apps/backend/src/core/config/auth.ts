// Auth configuration, read from the process environment.
//
// The values themselves are declared and validated by varlock in `.env.schema`.
// Everything here has a default so a local checkout starts without secrets; the
// OIDC routes report `oidc-not-configured` when a client id/secret is missing.

const DEFAULT_AUTHORIZE_ENDPOINT = 'https://open-id.up.pt/realms/sigarra/protocol/openid-connect/auth'
const DEFAULT_TOKEN_ENDPOINT = 'https://open-id.up.pt/realms/sigarra/protocol/openid-connect/token'
const DEFAULT_USERINFO_ENDPOINT = 'https://open-id.up.pt/realms/sigarra/protocol/openid-connect/userinfo'

export type AuthConfig = {
  /** True once a client id and secret are present; false disables the OIDC routes. */
  oidcConfigured: boolean
  clientId: string
  clientSecret: string
  redirectUri: string
  authorizeEndpoint: string
  tokenEndpoint: string
  userinfoEndpoint: string
  scopes: string
  sessionTtlSeconds: number
  frontendUrl: string
  allowedOrigins: string[]
  secureCookies: boolean
  devLoginEnabled: boolean
}

function readString(env: NodeJS.ProcessEnv, key: string, fallback: string): string {
  const value = env[key]?.trim()
  return value ? value : fallback
}

export function loadAuthConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const frontendUrl = readString(env, 'FRONTEND_URL', 'http://localhost:3100')
  const clientId = env.OIDC_CLIENT_ID?.trim() ?? ''
  const clientSecret = env.OIDC_CLIENT_SECRET?.trim() ?? ''

  const allowedOrigins = readString(env, 'ALLOWED_ORIGINS', frontendUrl)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return {
    oidcConfigured: clientId.length > 0 && clientSecret.length > 0,
    clientId,
    clientSecret,
    redirectUri: readString(env, 'OIDC_REDIRECT_URI', 'http://localhost:3000/api/v1/auth/callback'),
    authorizeEndpoint: readString(env, 'OIDC_AUTHORIZE_ENDPOINT', DEFAULT_AUTHORIZE_ENDPOINT),
    tokenEndpoint: readString(env, 'OIDC_TOKEN_ENDPOINT', DEFAULT_TOKEN_ENDPOINT),
    userinfoEndpoint: readString(env, 'OIDC_USERINFO_ENDPOINT', DEFAULT_USERINFO_ENDPOINT),
    scopes: readString(env, 'OIDC_SCOPES', 'openid email profile uporto_data'),
    sessionTtlSeconds: Number(readString(env, 'SESSION_TTL_DAYS', '30')) * 24 * 60 * 60,
    frontendUrl,
    allowedOrigins: allowedOrigins.length > 0 ? allowedOrigins : [frontendUrl],
    secureCookies: env.NODE_ENV === 'production' || env.COOKIE_SECURE === 'true',
    devLoginEnabled: env.DEV_LOGIN_ENABLED === 'true',
  }
}
