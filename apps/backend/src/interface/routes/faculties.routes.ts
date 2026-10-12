import { Elysia, t } from 'elysia'

import { HttpError } from '@/interface/errors/errors'
import { apiError } from '@/interface/middleware/error-handler'
import type { FacultyRepository } from '@/domain/ports/FacultyRepository'

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

/**
 * The reference feature from I-1: the first routes built on the port injected
 * by `main.ts`, and the pattern every other endpoint issue copies.
 *
 * Behaviour the pattern fixes here:
 * - the route never imports infrastructure; it reads `facultyRepository` off
 *   the context, so the handler is a few lines of HTTP shaping
 * - a missing faculty throws `new HttpError('faculty-not-found', ...)` — the
 *   domain code from `endpoints.md`, not the generic `not-found` — and the
 *   global `onError` hook formats it, so the handler never builds an error body
 *   itself
 * - query params are declared with Elysia's `t` schema, so a bad `year` is
 *   answered 422 `validation-error` by the hook instead of reaching the
 *   handler
 *
 * Response shapes follow `apps/backend/docs/endpoints.md` §2. The two list
 * routes answer a bare array on purpose: `endpoints.md` §Conventions scopes
 * pagination (`page` / `page_size` / `limit`) to admin and marketplace lists,
 * and the catalog is a handful of rows, so there is nothing to page.
 */
/**
 * `main.ts` decorates `facultyRepository` onto the Elysia context, but Elysia
 * does not propagate a parent instance's `decorate` types into a standalone
 * plugin — a route in its own `new Elysia(...)` sees an empty context. So the
 * dependency is declared on the instance's own type instead, which is the
 * framework's way of typing an injected dependency. Runtime behaviour is
 * unchanged: `use()` merges the parent's decoration in.
 */
type FacultyDependencies = {
  decorator: { facultyRepository: FacultyRepository }
  store: {}
  derive: {}
  resolve: {}
}

export const facultyRoutes = new Elysia<'/api/v1/faculties', FacultyDependencies>({
  prefix: '/api/v1/faculties',
})
  .get('/', ({ facultyRepository }) => facultyRepository.findAll(), {
    response: { 200: t.Array(faculty) },
    detail: { tags: ['faculties'], summary: 'List faculties' },
  })
  .get(
    '/:acronym',
    async ({ facultyRepository, params }) => {
      const faculty = await facultyRepository.findByAcronym(params.acronym)
      if (!faculty) throw new HttpError('faculty-not-found', `Faculty ${params.acronym} not found`, 404)

      return faculty
    },
    {
      response: { 200: faculty, 404: apiError },
      detail: { tags: ['faculties'], summary: 'Get one faculty' },
    },
  )
  .get(
    '/:acronym/courses',
    async ({ facultyRepository, params, query }) => {
      const faculty = void facultyRepository.findByAcronym(params.acronym)
      if (!faculty) throw new HttpError('faculty-not-found', `Faculty ${params.acronym} not found`, 404)

      const year = query.year

      return facultyRepository.findCoursesByFaculty(params.acronym, year)
    },
    {
      response: { 200: t.Array(course), 404: apiError },
      detail: { tags: ['faculties'], summary: 'Courses offered by a faculty' },
      query: t.Object({ year: t.Optional(t.Numeric()) }),
    },
  )
