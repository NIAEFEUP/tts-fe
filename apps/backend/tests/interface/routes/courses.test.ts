import assert from 'node:assert/strict'
import { test } from 'node:test'

import type { AuthUser } from '@/core/auth/user'
import type { Course, CourseRepository } from '@/domain/ports/course.repository'
import type { SessionRepository } from '@/domain/ports/session.repository'
import { createApp } from '@/main'

// Drives the real app via `createApp().handle(request)` — no listener or database.
// A fake `CourseRepository` stands in for the database, so tests assert real HTTP
// behaviour: status codes, error bodies, and query validation. A fake
// `SessionRepository` backs the auth guard: `SESSION_TOKEN` is the only session
// the app recognises, and every request presents it unless told otherwise.

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

const repository: CourseRepository = {
  async findAll(filter = {}) {
    return courses.filter(
      (course) =>
        (filter.year === undefined || course.year === filter.year) &&
        (filter.faculty === undefined || course.faculties.includes(filter.faculty)),
    )
  },

  async findById(id) {
    return courses.find((course) => course.id === id) ?? null
  },
}

const USER: AuthUser = {
  id: 'up202012345',
  name: 'Ana Silva',
  email: 'up202012345@up.pt',
  role: 'USER',
}

const SESSION_TOKEN = 'valid-session'

const sessions: SessionRepository = {
  issue: async () => SESSION_TOKEN,
  resolve: async (token) => (token === SESSION_TOKEN ? USER : null),
  revoke: async () => {},
}

const app = createApp({
  repositories: { courseRepository: repository, sessionRepository: sessions },
})

const get = async (path: string, options: { authenticated?: boolean } = {}) => {
  const response = await app.handle(
    new Request(`http://localhost${path}`, {
      headers: options.authenticated === false ? undefined : { cookie: `session=${SESSION_TOKEN}` },
    }),
  )

  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body: (await response.json()) as unknown,
  }
}

test('an anonymous caller is rejected with a 401 unauthorized', async () => {
  const list = await get('/v1/courses', { authenticated: false })
  const single = await get('/v1/courses/22841', { authenticated: false })

  assert.equal(list.status, 401)
  assert.deepEqual(list.body, { error: 'Authentication required', code: 'unauthorized' })
  assert.equal(single.status, 401)
  assert.deepEqual(single.body, { error: 'Authentication required', code: 'unauthorized' })
})

test('an unrecognised session cookie is rejected with a 401', async () => {
  const response = await app.handle(
    new Request('http://localhost/v1/courses', { headers: { cookie: 'session=forged' } }),
  )

  assert.equal(response.status, 401)
  assert.deepEqual(await response.json(), { error: 'Authentication required', code: 'unauthorized' })
})

test('every course is listed with the faculties that offer it', async () => {
  const { status, contentType, body } = await get('/v1/courses')

  assert.equal(status, 200)
  assert.match(contentType, /^application\/json/)
  assert.deepEqual(body, courses)
})

test('the year query param filters the courses', async () => {
  const current = await get('/v1/courses?year=2025')
  const previous = await get('/v1/courses?year=2024')

  assert.deepEqual(current.body, [courses[0], courses[1]])
  assert.deepEqual(previous.body, [courses[2]])
})

test('the faculty query param filters the courses', async () => {
  const fcup = await get('/v1/courses?faculty=FCUP')

  assert.deepEqual(fcup.body, [courses[1]])
})

test('the year and faculty filters combine', async () => {
  const { status, body } = await get('/v1/courses?year=2024&faculty=FEUP')

  assert.equal(status, 200)
  assert.deepEqual(body, [courses[2]])
})

test('an unknown faculty answers an empty list, not an error', async () => {
  const { status, body } = await get('/v1/courses?faculty=NOPE')

  assert.equal(status, 200)
  assert.deepEqual(body, [])
})

test('a course is returned by its id', async () => {
  const { status, body } = await get('/v1/courses/22841')

  assert.equal(status, 200)
  assert.deepEqual(body, courses[0])
})

test('an unknown course id answers 404 course-not-found instead of null', async () => {
  const { status, body } = await get('/v1/courses/99999')

  assert.equal(status, 404)
  assert.deepEqual(body, { error: 'Course 99999 not found', code: 'course-not-found' })
})

test('a non-numeric course id is rejected by the params schema, not the handler', async () => {
  const { status, body } = await get('/v1/courses/not-a-number')

  assert.equal(status, 422)
  assert.deepEqual(body, { error: 'Request failed validation', code: 'validation-error' })
})

test('a non-numeric year is rejected by the query schema', async () => {
  const { status, body } = await get('/v1/courses?year=feup')

  assert.equal(status, 422)
  assert.deepEqual(body, { error: 'Request failed validation', code: 'validation-error' })
})
