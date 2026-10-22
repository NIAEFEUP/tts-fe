import type { CourseUnitRepository } from '@/domain/ports/course-unit.repository'
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
      return (
        (await db.orm.public.CourseUnit.where({ id })
          .select('id', 'courseId', 'acronym', 'name', 'semester')
          .first()) ?? null
      )
    },

    // GET /v1/courses/:id/units — every unit the course offers, by acronym.
    async findByCourse(courseId) {
      return db.orm.public.CourseUnit.where((unit) => unit.courseId.eq(courseId))
        .select('id', 'courseId', 'acronym', 'name', 'semester')
        .orderBy((unit) => unit.acronym.asc())
        .all()
    },
  }
}
