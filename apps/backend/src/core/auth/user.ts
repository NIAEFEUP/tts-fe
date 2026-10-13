// The authenticated identity as the application understands it. Lives in the
// shared kernel because every layer needs it: the domain ports describe it, the
// application uses it, and infrastructure maps it out of the storage row.

export type UserRole = 'USER' | 'ADMIN' | 'SUPERUSER'

export type AuthUser = {
  /** NMEC ("up" number). */
  id: string
  name: string
  email: string | null
  role: UserRole
}

/** ADMIN and above may open the admin panel; USER may not. */
export function isAdmin(user: AuthUser): boolean {
  return user.role !== 'USER'
}
