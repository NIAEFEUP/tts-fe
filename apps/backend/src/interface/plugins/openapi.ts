import { Elysia, t } from 'elysia'
import { openapi } from '@elysia/openapi'

/**
 * OpenAPI documentation plugin.
 *
 * Serves a Scalar UI at `/openapi`. The shared `ApiError` schema is
 * registered as a named model and referenced by name in route response
 * schemas, so the spec inlines it only once under `#/components/schemas`.
 *
 * The route-level `detail` metadata (tags, summaries) lives alongside each
 * route definition — this plugin only wires up the documentation config.
 */
export const openapiPlugin = new Elysia({ name: 'openapi' })
  .model({ ApiError: t.Object({ error: t.String(), code: t.String() }) })
  .use(
    openapi({
      documentation: {
        info: {
          title: 'TTS API',
          version: '1.0.0',
          description: 'Course exchange platform API',
        },
        tags: [
          { name: 'health', description: 'Health check endpoints' },
          { name: 'auth', description: 'Authentication and session endpoints' },
          { name: 'auth-compat', description: 'Legacy auth routes for the un-migrated frontend' },
          { name: 'faculties', description: 'Faculty and course catalog' },
        ],
      },
    }),
  )
