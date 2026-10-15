import type { Db } from '@/infrastructure/database/prisma'

import type { FacultyRepository } from '@/domain/ports/faculty.repository'

/**
 * Prisma implementation of `FacultyRepository`. `FacultyCourse` is an explicit
 * many-to-many join, so resolving a faculty's courses takes three reads:
 * join rows, the courses they name, then each course's faculty acronyms.
 */
export function createFacultyRepository({ db }: { db: Db }): FacultyRepository {
  return {
    async findAll() {
      const rows = await db.orm.public.Faculty.orderBy((faculty) => faculty.acronym.asc()).all()

      return rows.map((row) => ({ acronym: row.acronym, name: row.name }))
    },

    async findByAcronym(acronym) {
      const row = await db.orm.public.Faculty.where({ acronym }).first()

      return row ? { acronym: row.acronym, name: row.name } : null
    },

    async findCoursesByFaculty(acronym, year) {
      const links = await db.orm.public.FacultyCourse.where((link) => link.facultyId.eq(acronym)).all()
      const courseIds = links.map((link) => link.courseId)
      if (courseIds.length === 0) return []

      const rows = await selectCourses(db, courseIds, year)
      if (rows.length === 0) return []

      const facultyLinks = await db.orm.public.FacultyCourse.where((link) =>
        link.courseId.in(rows.map((row) => row.id)),
      )
        .orderBy((link) => link.facultyId.asc())
        .all()

      const facultiesByCourse = new Map<number, string[]>()
      for (const link of facultyLinks) {
        const faculties = facultiesByCourse.get(link.courseId)
        if (faculties) faculties.push(link.facultyId)
        else facultiesByCourse.set(link.courseId, [link.facultyId])
      }

      return rows.map((row) => ({
        id: row.id,
        acronym: row.acronym,
        name: row.name,
        courseType: row.courseType,
        year: row.year,
        url: row.url,
        faculties: facultiesByCourse.get(row.id) ?? [],
      }))
    },
  }
}

async function selectCourses(db: Db, courseIds: number[], year?: number) {
  const courses = db.orm.public.Course

  return year === undefined
    ? courses
        .where((course) => course.id.in(courseIds))
        .orderBy((course) => course.acronym.asc())
        .all()
    : courses
        .where((course) => course.id.in(courseIds))
        .where((course) => course.year.eq(year))
        .orderBy((course) => course.acronym.asc())
        .all()
}
