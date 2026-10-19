import { Elysia, t } from 'elysia'
import type { EnrollmentRepository } from '@/domain/ports/enrollment.repository'
import type { SessionRepository } from '@/domain/ports/session.repository'
import { createAuthMiddleware } from '@/interface/middleware/auth.middleware'
import { httpError } from '@/interface/errors/errors'

const enrollment = t.Object({
  occurrence: t.Object({
    id: t.Number(),
    year: t.Number(),
    courseUnit: t.Object({
      id: t.Number(),
      acronym: t.String(),
      name: t.String(),
      semester: t.Number(),
    }),
  }),
  class: t.Object({
    id: t.Number(),
    name: t.String(),
    vacancies: t.Union([t.Number(), t.Null()]),
    slots: t.Array(
      t.Object({
        id: t.Number(),
        lessonType: t.String(),
        dayOfWeek: t.Number(),
        startMinute: t.Number(),
        durationMin: t.Number(),
        location: t.Union([t.String(), t.Null()]),
        professors: t.Array(
          t.Object({
            id: t.Number(),
            acronym: t.Union([t.String(), t.Null()]),
            name: t.Union([t.String(), t.Null()]),
          }),
        ),
      }),
    ),
  }),
})

type EnrollmentRoutesDeps = {
  enrollments: EnrollmentRepository
  sessions: SessionRepository
}

export const enrollmentRoutes = ({ enrollments, sessions }: EnrollmentRoutesDeps) =>
  new Elysia({ prefix: '/api/v1/users/me' })
    .model({ ApiError: t.Object({ error: t.String(), code: t.String() }) })
    .use(createAuthMiddleware({ resolveSession: sessions.resolve }))
    .get(
      '/enrollments',
      ({ user }) => {
        if (!user) throw httpError.unauthorized()
        return enrollments.findByUserId(user.id)
      },
      {
        response: { 200: t.Array(enrollment), 401: 'ApiError' },
        detail: { tags: ['users'], summary: 'List my class enrollments' },
      },
    )
