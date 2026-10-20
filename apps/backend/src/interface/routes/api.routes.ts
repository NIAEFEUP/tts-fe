import { Elysia } from 'elysia'

import { healthRoutes } from './health.routes'
import { facultyRoutes } from './faculties.routes'
import { authRoutes } from './auth/auth.routes'
import type { AuthRoutesDeps } from './auth/auth.routes'
import { authCompatRoutes } from './auth/auth-compat.routes'
import { enrollmentRoutes } from './users/enrollments.routes'

export const createApiRoutes = (deps: AuthRoutesDeps) => {
  return new Elysia()
    .use(healthRoutes)
    .use(facultyRoutes)
    .use(authRoutes(deps))
    .use(authCompatRoutes(deps))
    .use(enrollmentRoutes(deps.sessions))
}
