import { createHash } from 'node:crypto'
import { Temporal } from 'temporal-polyfill'
import { randomToken } from '@/core/utils/crypto'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { Database } from '@/infrastructure/database/prisma'
import { toAuthUser } from './auth-user.mapper'

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/**
 * Sessions are opaque tokens: the raw value is only ever handed to the client,
 * while the database stores `sha256(token)` as the primary key. A DB leak then
 * yields no usable cookie.
 */
export function createSessionRepository({ db }: { db: Database }): SessionRepository {
  return {
    async issue(userId, ttlMs) {
      const token = randomToken()
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
