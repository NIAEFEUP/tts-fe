import type { UserRepository } from '@/domain/ports/user.repository'
import type { Db } from '@/infrastructure/database/prisma'
import { toAuthUser } from './auth-user.mapper'

export function createUserRepository({ db }: { db: Db }): UserRepository {
  return {
    async upsertFromClaims(claims) {
      // One atomic statement: two concurrent first logins both find no row, and
      // a read-then-create hand-rolled version would make the second insert hit
      // the primary key and 500 on a valid login. Prisma upsert handles the
      // get-or-create in the database, in one round trip.
      const row = await db.orm.public.User.upsert({
        create: { id: claims.nmec, name: claims.name, email: claims.email },
        update: { name: claims.name, email: claims.email },
      })
      return toAuthUser(row)
    },

    async findById(id) {
      const row = await db.orm.public.User.where({ id }).first()
      return row ? toAuthUser(row) : null
    },
  }
}
