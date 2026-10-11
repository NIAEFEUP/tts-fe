import type { UserRepository } from '@/domain/ports/user.repository'
import type { AuthUser, UserRole } from '@/core/auth/user'
import type { Database } from '@/infrastructure/database/prisma'

type UserRow = { id: string; name: string; email: string | null; role: string }

function toAuthUser(row: UserRow): AuthUser {
  return { id: row.id, name: row.name, email: row.email, role: row.role as UserRole }
}

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
