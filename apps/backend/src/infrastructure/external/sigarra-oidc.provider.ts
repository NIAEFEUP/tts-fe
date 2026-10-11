import { normalizeNmec } from '@/core/auth/nmec'
import type { IdentityProvider, OidcUserClaims } from '@/domain/ports/identity-provider'

export type SigarraOidcConfig = {
  clientId: string
  clientSecret: string
  redirectUri: string
  authorizeEndpoint: string
  tokenEndpoint: string
  userinfoEndpoint: string
  scopes: string
}

/** Raised when the token or userinfo exchange fails. */
export class OidcExchangeError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'OidcExchangeError'
  }
}

function mapClaims(claims: Record<string, unknown>): OidcUserClaims {
  const nmec = normalizeNmec(typeof claims.nmec === 'string' ? claims.nmec : '')
  if (!nmec) {
    throw new OidcExchangeError('Sigarra userinfo did not include an "nmec" claim')
  }

  const givenName = typeof claims.given_name === 'string' ? claims.given_name : ''
  const familyName = typeof claims.family_name === 'string' ? claims.family_name : ''
  const fullName = typeof claims.name === 'string' ? claims.name : `${givenName} ${familyName}`
  const email = typeof claims.email === 'string' ? claims.email : null

  return { nmec, name: fullName.trim() || nmec, email }
}

/**
 * Manual OIDC authorization-code flow against the Sigarra realm. We are a
 * confidential client (client id + secret), so the token exchange happens
 * server-side; claims come from the userinfo endpoint.
 */
export function createSigarraOidcProvider(config: SigarraOidcConfig): IdentityProvider {
  return {
    authorizationUrl({ state, nonce }) {
      const url = new URL(config.authorizeEndpoint)
      url.searchParams.set('client_id', config.clientId)
      url.searchParams.set('redirect_uri', config.redirectUri)
      url.searchParams.set('response_type', 'code')
      url.searchParams.set('scope', config.scopes)
      url.searchParams.set('state', state)
      url.searchParams.set('nonce', nonce)
      return url.toString()
    },

    async exchangeCodeForUser(code) {
      const tokenResponse = await fetch(config.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: config.redirectUri,
          client_id: config.clientId,
          client_secret: config.clientSecret,
        }),
      })

      if (!tokenResponse.ok) {
        throw new OidcExchangeError(`Sigarra token endpoint returned ${tokenResponse.status}`)
      }

      const tokens = (await tokenResponse.json()) as { access_token?: string }
      if (!tokens.access_token) {
        throw new OidcExchangeError('Sigarra token response did not include an access_token')
      }

      const userResponse = await fetch(config.userinfoEndpoint, {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })

      if (!userResponse.ok) {
        throw new OidcExchangeError(`Sigarra userinfo endpoint returned ${userResponse.status}`)
      }

      return mapClaims((await userResponse.json()) as Record<string, unknown>)
    },
  }
}
