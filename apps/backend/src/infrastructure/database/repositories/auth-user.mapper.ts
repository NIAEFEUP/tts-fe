import type { AuthUser } from '@/core/auth/user'

/**
 * Maps a database row onto `AuthUser`. The generated Prisma contract already
 * types `role` as the narrow `'USER' | 'ADMIN' | 'SUPERUSER'` union, so no cast
 * is needed — do not widen `role` to `string` upstream (a hand-written `UserRow`
 * type does exactly that and manufactures `as UserRole` casts again, throwing
 * away the guarantee that a new enum value fails to compile).
 *
 * Extra row fields (e.g. `createdAt`) are simply ignored.
 */
export function toAuthUser(row: { id: string; name: string; email: string | null; role: AuthUser['role'] }): AuthUser {
  return { id: row.id, name: row.name, email: row.email, role: row.role }
}
