// Read-side port for the faculty catalog — the only way the route layer may
// reach the catalog.
//
// It also owns the shapes the catalog is read as: the API's view of a faculty
// and a course (`apps/backend/docs/endpoints.md` §2), not the way Prisma
// stores them. They live here rather than in `domain/entities/` because that
// directory is for entities with behaviour, and the clean-architecture lint
// rule lets `infrastructure/` import from `domain/ports/` only.
//
// Why a port at all: the routes would otherwise spell Prisma query syntax, and
// a change to the ORM would mean editing every route. The route depends on this
// interface; the implementation lives in
// `infrastructure/database/repositories/`. `main.ts` decides which
// implementation goes on the context, so a test can put a fake there instead
// and assert real behaviour with no database.

/** A faculty: its Sigarra acronym is the identifier. */
export type Faculty = {
  acronym: string
  name: string | null
}

/**
 * A degree offered by a faculty. A course can be shared between faculties
 * (e.g. MAP / PRODEB), so it carries every faculty acronym that offers it —
 * a list, not a single field.
 */
export type Course = {
  id: number
  acronym: string
  name: string
  courseType: string
  /** Academic year, e.g. 2025. */
  year: number
  url: string
  faculties: string[]
}

export interface FacultyRepository {
  /** Every faculty, ordered by acronym. */
  findAll(): Promise<Faculty[]>

  /** The faculty for an exact acronym match, or `null` when it does not exist. */
  findByAcronym(acronym: string): Promise<Faculty | null>

  /**
   * Courses offered by a faculty, with the faculty acronyms of each course.
   * `year` filters to one academic year when given.
   */
  findCoursesByFaculty(acronym: string, year?: number): Promise<Course[]>
}
