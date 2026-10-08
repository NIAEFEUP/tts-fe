// Seed the local development database from the scraper catalog.
//
// Prisma 8 has no `prisma db seed`; the documented pattern is a standalone
// script that imports the `db` client and is invoked from package.json. See the
// package-owned prisma-8 skill, `references/migrations.md` § *What Prisma 8
// doesn't do yet*.
//
// The seed populates exactly what the scraper's `database.db` contains — the
// university catalog — and nothing invented. That is:
//
//   faculty          → Faculty
//   course           → Course (+ FacultyCourse from course.faculty_id)
//   course_unit      → CourseUnit (abstract) + Occurrence (the Sigarra id)
//   course_metadata  → Occurrence.ects
//
// The scraper's `course_group`, `course_unit_course_group` and `info` tables
// have no successor in `contract.prisma` and are dropped.
//
// Scope: FEUP's three software-engineering courses — L.EIC, M.EIC, MESW.
// The slice lives in the committed fixture; see `bun run catalog:extract`.
//
// Run: bun run db:seed
//
// DESTRUCTIVE: this deletes every row before inserting. It refuses to run
// against anything but a loopback database.

import 'temporal-polyfill/global' // Prisma 8 DateTime fields are Temporal.Instant

import { db } from '@/infrastructure/database/prisma'
import fixture from './fixtures/feup-leic-meic-mesw.json' with { type: 'json' }

// --- Safety guard -----------------------------------------------------------

const LOOPBACK_HOSTS = new Set(['127.0.0.1', 'localhost', '::1', '[::1]'])
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not set.')

const { hostname } = new URL(databaseUrl)
if (!LOOPBACK_HOSTS.has(hostname)) {
  throw new Error(
    `Refusing to seed ${hostname}: this script deletes every row and only runs ` +
      `against a loopback DATABASE_URL (got host "${hostname}").`,
  )
}

// --- Seed -------------------------------------------------------------------

const summary = await db.transaction(async (tx) => {
  // 1. Reset. One TRUNCATE clears every table in the contract and, with
  //    RESTART IDENTITY, resets the autoincrement sequences so a re-seed
  //    always yields the same ids (CourseUnit starting at 1) instead of
  //    ever-growing ones. CASCADE covers the FK graph without ordering.
  const truncate = db.raw.sql`
    TRUNCATE TABLE
      "AdminCourse", "AdminOccurrence", "Class", "Course", "CourseUnit",
      "Enrollment", "EnrollmentRequest", "EnrollmentRequestOption",
      "ExchangeItem", "ExchangePeriod", "ExchangeRequest", "Faculty",
      "FacultyCourse", "Occurrence", "PlannerState", "Professor",
      "ScheduleSlot", "Session", "SlotClass", "SlotProfessor",
      "StudentCourseMetadata", "User"
    RESTART IDENTITY CASCADE
  `
    .affectedCount()
    .build()
  await tx.execute(truncate)

  // 2. University catalog, straight from the scraper fixture.
  await tx.orm.public.Faculty.create({
    acronym: fixture.faculty.acronym,
    name: fixture.faculty.name,
  })

  await tx.orm.public.Course.createAll(
    fixture.courses.map((c) => ({
      id: c.id,
      acronym: c.acronym,
      name: c.name,
      courseType: c.courseType,
      year: c.year,
      url: c.url,
    })),
  )

  await tx.orm.public.FacultyCourse.createAll(
    fixture.courses.map((c) => ({
      facultyId: fixture.faculty.acronym,
      courseId: c.id,
    })),
  )

  // CourseUnit ids are autoincrement, so create them one by one and remember
  // the generated id for each fixture key.
  const unitIdByKey = new Map<string, number>()
  for (const unit of fixture.courseUnits) {
    const row = await tx.orm.public.CourseUnit.select('id').create({
      courseId: unit.courseId,
      acronym: unit.acronym,
      name: unit.name,
      semester: unit.semester,
    })
    unitIdByKey.set(unit.key, row.id)
  }

  await tx.orm.public.Occurrence.createAll(
    fixture.occurrences.map((o) => {
      const courseUnitId = unitIdByKey.get(o.courseUnitKey)
      if (courseUnitId === undefined) {
        throw new Error(`No CourseUnit for key "${o.courseUnitKey}"`)
      }
      return {
        id: o.id,
        courseUnitId,
        courseId: o.courseId,
        year: o.year,
        ects: o.ects,
        url: o.url,
        hash: o.hash,
      }
    }),
  )

  return {
    courses: fixture.courses.length,
    courseUnits: fixture.courseUnits.length,
    occurrences: fixture.occurrences.length,
  }
})

await db.close()

console.log(
  `Seeded ${summary.courses} courses, ${summary.courseUnits} course units, ` + `${summary.occurrences} occurrences.`,
)
