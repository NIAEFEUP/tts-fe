import { randomToken } from '@/core/utils/crypto'
import type { IdentityProvider } from '@/domain/ports/identity-provider'

export type BeginLoginResult = {
  /** Where to redirect the browser to start the OIDC flow. */
  url: string
  /** CSRF-bound state, echoed back by the IdP and checked on the callback. */
  state: string
  /** Replay-protection nonce, sent to the IdP. */
  nonce: string
  /** Sanitised post-login destination (always a known frontend origin). */
  returnTo: string
}

/**
 * Only allow returning to the configured frontend origin, so `return_to` can't
 * turn the login into an open redirect. Relative paths resolve against the
 * frontend URL.
 */
export function resolveReturnTo(returnTo: string | undefined, frontendUrl: string): string {
  const fallback = new URL(frontendUrl).toString()
  if (!returnTo) return fallback

  try {
    const target = returnTo.startsWith('/') ? new URL(returnTo, frontendUrl) : new URL(returnTo)
    return target.origin === new URL(frontendUrl).origin ? target.toString() : fallback
  } catch {
    return fallback
  }
}

export function createBeginLogin(deps: { provider: IdentityProvider; frontendUrl: string }) {
  return function beginLogin(returnTo?: string): BeginLoginResult {
    const state = randomToken(16)
    const nonce = randomToken(16)
    return {
      url: deps.provider.authorizationUrl({ state, nonce }),
      state,
      nonce,
      returnTo: resolveReturnTo(returnTo, deps.frontendUrl),
    }
  }
}
