// Read-side port for the faculty catalog. Routes depend on this interface;
// the Prisma implementation lives in `infrastructure/database/repositories/`.

/** A faculty identified by its Sigarra acronym. */
export type Faculty = {
  acronym: string
  name: string | null
}

/** A degree offered by a faculty. Shared courses carry all offering faculty acronyms. */
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

export type FacultyRepository = {
  /** Every faculty, ordered by acronym. */
  findAll(): Promise<Faculty[]>

  /** Faculty for an exact acronym match, or `null` if none exists. */
  findByAcronym(acronym: string): Promise<Faculty | null>

  /** Courses offered by a faculty. `year` filters to one academic year when given. */
  findCoursesByFaculty(acronym: string, year?: number): Promise<Course[]>
}
