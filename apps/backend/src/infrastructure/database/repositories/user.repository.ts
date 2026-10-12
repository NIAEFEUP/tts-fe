import type { UserRepository } from '@/domain/ports/user.repository'
import type { Database } from '@/infrastructure/database/prisma'
import { toAuthUser } from './auth-user.mapper'

export function createUserRepository({ db }: { db: Database }): UserRepository {
  return {
    async upsertFromClaims(claims) {
      const existing = await db.orm.public.User.where({ id: claims.nmec }).first()

      if (existing) {
        if (existing.name !== claims.name || existing.email !== claims.email) {
          await db.orm.public.User.where({ id: claims.nmec }).update({
            name: claims.name,
            email: claims.email,
          })
        }
        return toAuthUser({ ...existing, name: claims.name, email: claims.email })
      }

      const created = await db.orm.public.User.create({
        id: claims.nmec,
        name: claims.name,
        email: claims.email,
      })
      return toAuthUser(created)
    },

    async findById(id) {
      const row = await db.orm.public.User.where({ id }).first()
      return row ? toAuthUser(row) : null
    },
  }
}
