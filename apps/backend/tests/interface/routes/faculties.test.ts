import { describe, expect, it } from 'bun:test'

import type { AuthUser } from '@/core/auth/user'
import type { SessionRepository } from '@/domain/ports/session.repository'
import { createApp } from '@/main'
import type { Course } from '@/domain/ports/course.repository'
import type { Faculty, FacultyRepository } from '@/domain/ports/faculty.repository'

// Drives the real app via `createApp().handle(request)` — no listener or database.
// A fake `FacultyRepository` stands in for the database, so tests assert real
// HTTP behaviour: status codes, error bodies, and query validation. A fake
// `SessionRepository` backs the auth guard: `SESSION_TOKEN` is the only session
// the app recognises, and every request presents it unless told otherwise.

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
  repositories: { facultyRepository: repository, sessionRepository: sessions },
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

describe('faculties routes', () => {
  it('an anonymous caller is rejected with a 401 unauthorized', async () => {
    const { status, body } = await get('/v1/faculties', { authenticated: false })

    expect(status).toBe(401)
    expect(body).toEqual({ error: 'Authentication required', code: 'unauthorized' })
  })

  it('an unrecognised session cookie is rejected with a 401', async () => {
    const response = await app.handle(
      new Request('http://localhost/v1/faculties', { headers: { cookie: 'session=forged' } }),
    )

    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Authentication required', code: 'unauthorized' })
  })

  it('every faculty is listed', async () => {
    const { status, contentType, body } = await get('/v1/faculties')

    expect(status).toBe(200)
    expect(contentType).toMatch(/^application\/json/)
    expect(body).toEqual(faculties)
  })

  it('a faculty is returned by its acronym', async () => {
    const { status, body } = await get('/v1/faculties/FEUP')

    expect(status).toBe(200)
    expect(body).toEqual({ acronym: 'FEUP', name: 'Faculdade de Engenharia' })
  })

  it('an unknown acronym answers 404 faculty-not-found instead of null', async () => {
    const { status, body } = await get('/v1/faculties/NOPE')

    expect(status).toBe(404)
    expect(body).toEqual({ error: 'Faculty NOPE not found', code: 'faculty-not-found' })
  })

  it('courses of a faculty carry every faculty that offers them', async () => {
    const { status, body } = await get('/v1/faculties/FCUP/courses')

    expect(status).toBe(200)
    expect(body).toEqual([courses[1]])
  })

  it('the year query param filters the courses', async () => {
    const current = await get('/v1/faculties/FEUP/courses?year=2025')
    const previous = await get('/v1/faculties/FEUP/courses?year=2024')

    expect(current.body).toEqual([courses[0], courses[1]])
    expect(previous.body).toEqual([courses[2]])
  })

  it('a faculty with no courses for that year answers an empty list, not an error', async () => {
    const { status, body } = await get('/v1/faculties/FEUP/courses?year=2019')

    expect(status).toBe(200)
    expect(body).toEqual([])
  })

  it('courses of an unknown faculty answer the same 404 as the faculty route', async () => {
    const { status, body } = await get('/v1/faculties/NOPE/courses')

    expect(status).toBe(404)
    expect(body).toEqual({ error: 'Faculty NOPE not found', code: 'faculty-not-found' })
  })

  it('a non-numeric year is rejected by the query schema, not the handler', async () => {
    const { status, body } = await get('/v1/faculties/FEUP/courses?year=feup')

    expect(status).toBe(422)
    expect(body).toEqual({ error: 'Request failed validation', code: 'validation-error' })
  })

  it('a non-integer year is rejected by the query schema', async () => {
    const { status, body } = await get('/v1/faculties/FEUP/courses?year=2025.5')

    expect(status).toBe(422)
    expect(body).toEqual({ error: 'Request failed validation', code: 'validation-error' })
  })
})
