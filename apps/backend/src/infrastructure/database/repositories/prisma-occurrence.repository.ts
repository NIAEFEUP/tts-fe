import type { Occurrence, OccurrenceRepository } from '@/domain/ports/occurrence.repository'
import type { Db } from '@/infrastructure/database/prisma'

/**
 * Prisma implementation of `OccurrenceRepository`.
 *
 * An `Occurrence` row is the concrete (course unit, course, academic year)
 * tuple — the place where a course unit is actually taught. Its primary key
 * is the composite `(id, year)`, because Sigarra reuses the same occurrence
 * id across academic years, so `id` alone is not unique.
 *
 * This is a factory function: it receives a database connection and returns
 * an object matching the OccurrenceRepository interface. The route never calls
 * this directly — it's wired up in main.ts via createRepositories(db).
 */
export function createOccurrenceRepository({ db }: { db: Db }): OccurrenceRepository {
  return {
    // GET /v1/course-units/:id/occurrences — every occurrence of one abstract
    // course unit, across every course and academic year it is taught in.
    async findByCourseUnit(courseUnitId) {
      const rows = await db.orm.public.Occurrence.where((occurrence) => occurrence.courseUnitId.eq(courseUnitId))
        .orderBy([(occurrence) => occurrence.year.desc(), (occurrence) => occurrence.id.asc()])
        .all()

      return rows.map(toOccurrence)
    },
  }
}

/** Pick the API-facing fields out of a raw `Occurrence` table row. */
function toOccurrence(row: {
  id: number
  courseUnitId: number
  courseId: number
  year: number
  ects: number
  url: string
  hash: string
}): Occurrence {
  return {
    id: row.id,
    courseUnitId: row.courseUnitId,
    courseId: row.courseId,
    year: row.year,
    ects: row.ects,
    url: row.url,
    hash: row.hash,
  }
}
