import type { AuthUser } from '@/core/auth/user'
import type { OidcUserClaims } from './identity-provider'

export type UserRepository = {
  /** Create the user on first login, refresh name/email on later logins. */
  upsertFromClaims(claims: OidcUserClaims): Promise<AuthUser>
  findById(id: string): Promise<AuthUser | null>
}
