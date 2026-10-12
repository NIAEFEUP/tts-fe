import { Elysia, t } from 'elysia'
import { openapi } from '@elysia/openapi'

/**
 * OpenAPI documentation plugin.
 *
 * Serves a Scalar UI at `/openapi` and registers the shared `ApiError`
 * schema as a named model so error responses reference it in the spec.
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
          { name: 'faculties', description: 'Faculty and course catalog' },
        ],
      },
    }),
  )
