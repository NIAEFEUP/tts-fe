// Port for the Sigarra identity provider (OIDC authorization-code flow).
//
// The provider is responsible only for building the redirect to the IdP and for
// turning an authorization code into a set of claims. Session handling, state
// verification and persistence live in the application layer.

export type OidcUserClaims = {
  /** NMEC ("up" number) — the claim that identifies a student. */
  nmec: string
  name: string
  email: string | null
}

export type AuthorizationParams = {
  state: string
  nonce: string
}

export type IdentityProvider = {
  /** Full URL to redirect the browser to, to begin the login. */
  authorizationUrl(params: AuthorizationParams): string
  /** Exchange the authorization code for the authenticated user's claims. */
  exchangeCodeForUser(code: string): Promise<OidcUserClaims>
}
