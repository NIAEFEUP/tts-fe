import type { AuthUser } from '@/core/auth/user'
import type { SessionRepository } from '@/domain/ports/session.repository'

export function createGetCurrentUser(deps: { sessions: SessionRepository }) {
  return function getCurrentUser(token: string | null | undefined): Promise<AuthUser | null> {
    return token ? deps.sessions.resolve(token) : Promise.resolve(null)
  }
}
