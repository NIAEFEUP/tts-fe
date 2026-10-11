import type { AuthUser } from '@/core/auth/user'
import type { IdentityProvider } from '@/domain/ports/identity-provider'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import { resolveReturnTo } from './begin-login'

/** Thrown when the `state` returned by the IdP doesn't match the one we issued. */
export class InvalidOidcStateError extends Error {
  constructor() {
    super('OIDC state mismatch')
    this.name = 'InvalidOidcStateError'
  }
}

export type CompleteLoginParams = {
  code: string
  state: string
  expectedState: string | undefined
  returnTo: string | undefined
}

export type CompleteLoginResult = {
  /** Raw session token to set as an httpOnly cookie. */
  token: string
  user: AuthUser
  /** Where to send the browser once the session cookie is set. */
  redirectTo: string
}

export function createCompleteLogin(deps: {
  provider: IdentityProvider
  users: UserRepository
  sessions: SessionRepository
  sessionTtlMs: number
  frontendUrl: string
}) {
  return async function completeLogin(params: CompleteLoginParams): Promise<CompleteLoginResult> {
    if (!params.expectedState || params.state !== params.expectedState) {
      throw new InvalidOidcStateError()
    }

    const claims = await deps.provider.exchangeCodeForUser(params.code)
    const user = await deps.users.upsertFromClaims(claims)
    const token = await deps.sessions.issue(user.id, deps.sessionTtlMs)

    return {
      token,
      user,
      redirectTo: resolveReturnTo(params.returnTo, deps.frontendUrl),
    }
  }
}
