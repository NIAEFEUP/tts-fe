import type { AuthUser } from '@/core/auth/user'

// Opaque, revocable session tokens. Only the hash of a token is persisted, so
// the raw value exists only in the client's cookie and in transit.
export type SessionRepository = {
  /** Mint a new session token for the user; returns the raw token to hand out. */
  issue(userId: string, ttlMs: number): Promise<string>
  /** Resolve a raw token to its user, or `null` if unknown/expired. */
  resolve(token: string): Promise<AuthUser | null>
  /** Delete the session behind a raw token. Idempotent. */
  revoke(token: string): Promise<void>
}
