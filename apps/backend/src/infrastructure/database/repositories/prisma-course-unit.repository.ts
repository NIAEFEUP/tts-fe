import type { CourseUnit, CourseUnitRepository } from '@/domain/ports/course-unit.repository'
import type { Db } from '@/infrastructure/database/prisma'

/**
 * Prisma implementation of `CourseUnitRepository`.
 *
 * A `CourseUnit` row is the abstract, year-agnostic template ("BD" — Bases de
 * Dados). It carries no classes or periods — those belong to `Occurrence`.
 *
 * This is a factory function: it receives a database connection and returns
 * an object matching the CourseUnitRepository interface. The route never calls
 * this directly — it's wired up in main.ts via createRepositories(db).
 */
export function createCourseUnitRepository({ db }: { db: Db }): CourseUnitRepository {
  return {
    // GET /v1/course-units/:id — one course unit by its id.
    async findById(id) {
      // `.where({ id }).first()` returns one row or null (route converts to 404).
      const row = await db.orm.public.CourseUnit.where({ id }).first()
      if (!row) return null

      return toCourseUnit(row)
    },

    // GET /v1/courses/:id/units — every unit the course offers, by acronym.
    async findByCourse(courseId) {
      const rows = await db.orm.public.CourseUnit.where((unit) => unit.courseId.eq(courseId))
        .orderBy((unit) => unit.acronym.asc())
        .all()

      return rows.map(toCourseUnit)
    },
  }
}

/** Pick the API-facing fields out of a raw `CourseUnit` table row. */
function toCourseUnit(row: {
  id: number
  courseId: number
  acronym: string
  name: string
  semester: number
}): CourseUnit {
  return {
    id: row.id,
    courseId: row.courseId,
    acronym: row.acronym,
    name: row.name,
    semester: row.semester,
  }
}
