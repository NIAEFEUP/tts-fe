import { db } from '@/infrastructure/database/prisma'

import type { Course, Faculty, FacultyRepository } from '@/domain/ports/FacultyRepository'

type Db = typeof db

/**
 * `FacultyRepository` on top of the Prisma 8 ORM client — the only file in the
 * feature that knows Prisma exists.
 *
 * `FacultyCourse` is the explicit many-to-many join (Prisma 8 has no implicit
 * one), so "courses of a faculty" is two reads — join rows for the faculty,
 * then the courses those rows name — plus a third read to resolve the faculty
 * acronyms of each course. The catalog is a few hundred rows per academic
 * year, so the extra reads are cheaper than a join-shaped API fight.
 */
export class PrismaFacultyRepository implements FacultyRepository {
  constructor(private readonly db: Db = db) {}

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
    ).all()

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
      ? courses.where((course) => course.id.in(courseIds)).all()
      : courses
          .where((course) => course.id.in(courseIds))
          .where((course) => course.year.eq(year))
          .all()
  }
}
