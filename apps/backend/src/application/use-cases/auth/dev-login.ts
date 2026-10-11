import { normalizeNmec } from '@/core/auth/nmec'
import type { AuthUser } from '@/core/auth/user'
import type { DevAuthenticator } from '@/domain/ports/dev-authenticator'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'

export type DevLoginResult =
  | { ok: true; token: string; user: AuthUser }
  | { ok: false; reason: 'not-configured' | 'invalid-credentials' }

/**
 * Dev-only login: validate a Sigarra username/password and mint a session. The
 * credentials come from the request when given, otherwise from the configured
 * dev account (`SIGARRA_USERNAME` / `SIGARRA_PASSWORD`).
 *
 * The user's name is whatever Sigarra returned (falling back to the stored name,
 * then `Student`), so a seeded placeholder is replaced by the real name on the
 * first dev login.
 */
export function createDevLogin(deps: {
  users: UserRepository
  sessions: SessionRepository
  authenticator: DevAuthenticator
  credentials: { username: string; password: string }
  sessionTtlMs: number
}) {
  return async function devLogin(override?: { username?: string; password?: string }): Promise<DevLoginResult> {
    const username = normalizeNmec(override?.username?.trim() || deps.credentials.username)
    const password = override?.password || deps.credentials.password

    if (!username || !password) return { ok: false, reason: 'not-configured' }

    const identity = await deps.authenticator.authenticate(username, password)
    if (!identity) return { ok: false, reason: 'invalid-credentials' }

    const existing = await deps.users.findById(username)
    const name = identity.name?.trim() || existing?.name || 'Student'
    const email = existing?.email ?? `${username}@fe.up.pt`

    // Only write when the name actually changes — keeps the seeded placeholder
    // when Sigarra gave us nothing, and the real name when it did.
    const user =
      existing && existing.name === name ? existing : await deps.users.upsertFromClaims({ nmec: username, name, email })

    const token = await deps.sessions.issue(user.id, deps.sessionTtlMs)
    return { ok: true, token, user }
  }
}
