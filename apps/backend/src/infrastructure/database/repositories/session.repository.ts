import { createHash, randomBytes } from 'node:crypto'
import { Temporal } from 'temporal-polyfill'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { AuthUser, UserRole } from '@/core/auth/user'
import type { Database } from '@/infrastructure/database/prisma'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

type UserRow = { id: string; name: string; email: string | null; role: string }

function toAuthUser(row: UserRow): AuthUser {
  return { id: row.id, name: row.name, email: row.email, role: row.role as UserRole }
}

/**
 * Sessions are opaque tokens: the raw value is only ever handed to the client,
 * while the database stores `sha256(token)` as the primary key. A DB leak then
 * yields no usable cookie.
 */
export function createSessionRepository({ db }: { db: Database }): SessionRepository {
  return {
    async issue(userId, ttlMs) {
      const token = randomBytes(32).toString('base64url')
      const expiresAt = Temporal.Now.instant().add({ milliseconds: ttlMs })

      await db.orm.public.Session.create({ tokenHash: hashToken(token), userId, expiresAt })

      return token
    },

    async resolve(token) {
      const tokenHash = hashToken(token)
      const session = await db.orm.public.Session.where({ tokenHash }).include('user').first()
      if (!session) return null

      if (Temporal.Instant.compare(session.expiresAt, Temporal.Now.instant()) <= 0) {
        // Opportunistically sweep the expired row so it can't be reused.
        await db.orm.public.Session.where({ tokenHash }).delete()
        return null
      }

      return toAuthUser(session.user)
    },

    async revoke(token) {
      await db.orm.public.Session.where({ tokenHash: hashToken(token) }).delete()
    },
  }
}
