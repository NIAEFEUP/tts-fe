import { db as defaultDb } from '@/infrastructure/database/prisma'
import type { Db } from '@/infrastructure/database/prisma'

import type { Course, Faculty, FacultyRepository } from '@/domain/ports/FacultyRepository'

/**
 * Prisma implementation of `FacultyRepository`. `FacultyCourse` is an explicit
 * many-to-many join, so resolving a faculty's courses takes three reads:
 * join rows, the courses they name, then each course's faculty acronyms.
 */
export class PrismaFacultyRepository implements FacultyRepository {
  constructor(private readonly db: Db = defaultDb) {}

  async findAll(): Promise<Faculty[]> {
    const rows = await this.db.orm.public.Faculty.orderBy((faculty) => faculty.acronym.asc()).all()

    return rows.map((row) => ({ acronym: row.acronym, name: row.name }))
  }

  async findByAcronym(acronym: string): Promise<Faculty | null> {
    const row = await this.db.orm.public.Faculty.where({ acronym }).first()

    return row ? { acronym: row.acronym, name: row.name } : null
  }

  async findCoursesByFaculty(acronym: string, year?: number): Promise<Course[]> {
    const links = await this.db.orm.public.FacultyCourse.where((link) => link.facultyId.eq(acronym)).all()
    const courseIds = links.map((link) => link.courseId)
    if (courseIds.length === 0) return []

    const rows = await this.selectCourses(courseIds, year)
    if (rows.length === 0) return []

    const facultyLinks = await this.db.orm.public.FacultyCourse.where((link) =>
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
  }

  private async selectCourses(courseIds: number[], year?: number) {
    const courses = this.db.orm.public.Course

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
}
