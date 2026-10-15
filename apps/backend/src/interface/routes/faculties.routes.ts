import { Elysia, t } from 'elysia'

import { HttpError } from '@/interface/errors/errors'

import type { FacultyRepository } from '@/domain/ports/faculty.repository'

const faculty = t.Object({
  acronym: t.String(),
  name: t.Union([t.String(), t.Null()]),
})

const course = t.Object({
  id: t.Number(),
  acronym: t.String(),
  name: t.String(),
  courseType: t.String(),
  year: t.Number(),
  url: t.String(),
  faculties: t.Array(t.String()),
})

// Routes read `repositories` off the Elysia context — no infrastructure imports.
// A missing faculty throws `HttpError('faculty-not-found')`; the global `onError`
// hook formats the response. Query params use Elysia's `t` schema so invalid
// input is rejected with 422 before reaching the handler.

// Elysia does not propagate a parent instance's `decorate` types into a
// standalone plugin, so the dependency is declared on the instance's own type.
// `use()` still merges the parent's decoration at runtime.
type FacultyDependencies = {
  decorator: { repositories: { facultyRepository: FacultyRepository } }
  store: {}
  derive: {}
  resolve: {}
}

export const facultyRoutes = new Elysia<'/api/v1/faculties', FacultyDependencies>({
  prefix: '/api/v1/faculties',
})
  .get('/', ({ repositories }) => repositories.facultyRepository.findAll(), {
    response: { 200: t.Array(faculty) },
    detail: { tags: ['faculties'], summary: 'List faculties' },
  })
  .get(
    '/:acronym',
    async ({ repositories, params }) => {
      const faculty = await repositories.facultyRepository.findByAcronym(params.acronym)
      if (!faculty) throw new HttpError('faculty-not-found', `Faculty ${params.acronym} not found`, 404)

      return faculty
    },
    {
      response: { 200: faculty, 404: 'ApiError' },
      detail: { tags: ['faculties'], summary: 'Get one faculty' },
    },
  )
  .get(
    '/:acronym/courses',
    async ({ repositories, params, query }) => {
      const faculty = await repositories.facultyRepository.findByAcronym(params.acronym)
      if (!faculty) throw new HttpError('faculty-not-found', `Faculty ${params.acronym} not found`, 404)

      const year = query.year

      return repositories.facultyRepository.findCoursesByFaculty(params.acronym, year)
    },
    {
      response: { 200: t.Array(course), 404: 'ApiError' },
      detail: { tags: ['faculties'], summary: 'Courses offered by a faculty' },
      query: t.Object({ year: t.Optional(t.Integer()) }),
    },
  )
