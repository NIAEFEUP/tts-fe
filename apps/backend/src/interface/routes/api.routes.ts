import { Elysia } from 'elysia'

import { healthRoutes } from './health.routes'
import { facultyRoutes } from './faculties.routes'
import { authRoutes } from './auth/auth.routes'
import type { AuthRoutesDeps } from './auth/auth.routes'
import { authCompatRoutes } from './auth/auth-compat.routes'
import { enrollmentRoutes } from './users/enrollments.routes'
import type { EnrollmentRepository } from '@/domain/ports/enrollment.repository'
import type { SessionRepository } from '@/domain/ports/session.repository'

export const createApiRoutes = (
  deps: AuthRoutesDeps & {
    enrollments: EnrollmentRepository
    sessions: SessionRepository
  },
) => {
  return new Elysia()
    .use(healthRoutes)
    .use(facultyRoutes)
    .use(authRoutes(deps))
    .use(authCompatRoutes(deps))
    .use(enrollmentRoutes(deps))
}
