import assert from 'node:assert/strict'
import { test } from 'node:test'

import { createApp } from '@/main'
import type { Course, Faculty, FacultyRepository } from '@/domain/ports/FacultyRepository'

// The reference integration-test pattern from I-1: drive the real app through
// `createApp().handle(request)` — no listener, no fixtures, no database. The
// route layer only ever talks to the `FacultyRepository` port, so a fake stands
// in for the database and these tests assert real HTTP behaviour (status,
// `{ error, code }` bodies, query validation) instead of "does not crash".

const faculties: Faculty[] = [
  { acronym: 'FCUP', name: 'Faculdade de Ciências' },
  { acronym: 'FEUP', name: 'Faculdade de Engenharia' },
]

const courses: Course[] = [
  {
    id: 22841,
    acronym: 'L.EIC',
    name: 'Licenciatura em Engenharia Informática e Computação',
    courseType: 'L',
    year: 2025,
    url: 'https://sigarra.up.pt/feup/pt/cur_geral.cur_view?pv_curso_id=22841',
    faculties: ['FEUP'],
  },
  {
    id: 22990,
    acronym: 'MAP',
    name: 'Mestrado em Avaliação e Políticas Públicas',
    courseType: 'M',
    year: 2025,
    url: 'https://sigarra.up.pt/fcup/pt/cur_geral.cur_view?pv_curso_id=22990',
    // A course shared by two faculties carries both.
    faculties: ['FCUP', 'FEUP'],
  },
  {
    id: 22201,
    acronym: 'L.EIC',
    name: 'Licenciatura em Engenharia Informática e Computação',
    courseType: 'L',
    year: 2024,
    url: 'https://sigarra.up.pt/feup/pt/cur_geral.cur_view?pv_curso_id=22201',
    faculties: ['FEUP'],
  },
]

const repository: FacultyRepository = {
  async findAll() {
    return faculties
  },

  async findByAcronym(acronym) {
    return faculties.find((faculty) => faculty.acronym === acronym) ?? null
  },

  async findCoursesByFaculty(acronym, year) {
    return courses.filter(
      (course) => course.faculties.includes(acronym) && (year === undefined || course.year === year),
    )
  },
}

const app = createApp({ facultyRepository: repository })

const get = async (path: string) => {
  const response = await app.handle(new Request(`http://localhost${path}`))

  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body: (await response.json()) as unknown,
  }
}

test('every faculty is listed', async () => {
  const { status, contentType, body } = await get('/api/v1/faculties')

  assert.equal(status, 200)
  assert.match(contentType, /^application\/json/)
  assert.deepEqual(body, faculties)
})

test('a faculty is returned by its acronym', async () => {
  const { status, body } = await get('/api/v1/faculties/FEUP')

  assert.equal(status, 200)
  assert.deepEqual(body, { acronym: 'FEUP', name: 'Faculdade de Engenharia' })
})

test('an unknown acronym answers 404 faculty-not-found instead of null', async () => {
  const { status, body } = await get('/api/v1/faculties/NOPE')

  assert.equal(status, 404)
  assert.deepEqual(body, { error: 'Faculty NOPE not found', code: 'faculty-not-found' })
})

test('courses of a faculty carry every faculty that offers them', async () => {
  const { status, body } = await get('/api/v1/faculties/FCUP/courses')

  assert.equal(status, 200)
  assert.deepEqual(body, [courses[1]])
})

test('the year query param filters the courses', async () => {
  const current = await get('/api/v1/faculties/FEUP/courses?year=2025')
  const previous = await get('/api/v1/faculties/FEUP/courses?year=2024')

  assert.deepEqual(current.body, [courses[0], courses[1]])
  assert.deepEqual(previous.body, [courses[2]])
})

test('a faculty with no courses for that year answers an empty list, not an error', async () => {
  const { status, body } = await get('/api/v1/faculties/FEUP/courses?year=2019')

  assert.equal(status, 200)
  assert.deepEqual(body, [])
})

test('courses of an unknown faculty answer the same 404 as the faculty route', async () => {
  const { status, body } = await get('/api/v1/faculties/NOPE/courses')

  assert.equal(status, 404)
  assert.deepEqual(body, { error: 'Faculty NOPE not found', code: 'faculty-not-found' })
})

test('a non-numeric year is rejected by the query schema, not the handler', async () => {
  const { status, body } = await get('/api/v1/faculties/FEUP/courses?year=feup')

  assert.equal(status, 422)
  assert.deepEqual(body, { error: 'Request failed validation', code: 'validation-error' })
})
