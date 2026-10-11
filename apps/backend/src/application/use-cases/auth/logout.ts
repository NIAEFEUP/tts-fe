import type { SessionRepository } from '@/domain/ports/session.repository'

export function createLogout(deps: { sessions: SessionRepository }) {
  return async function logout(token: string | null | undefined): Promise<void> {
    if (token) await deps.sessions.revoke(token)
  }
}
