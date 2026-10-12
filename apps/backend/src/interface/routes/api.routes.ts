import { Elysia } from 'elysia'

import { facultyRoutes } from './faculties.routes'

export const apiRoutes = new Elysia({ prefix: '/api/v1' }).use(facultyRoutes)
