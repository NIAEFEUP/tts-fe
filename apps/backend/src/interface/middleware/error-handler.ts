import { Elysia, t } from 'elysia'

import type { ApiErrorBody } from '@/core/errors/errors'
import { HttpError } from '@/core/errors/errors'

/**
 * Response schema for `{ error, code }`. Declare it on routes that can fail so
 * the frontend's Eden client (`apps/frontend/src/api/client.ts`, which types
 * from `App`) sees the error body typed too:
 *
 *   .get('/:acronym', handler, { response: { 404: apiError } })
 */
export const apiError = t.Object({
  error: t.String(),
  code: t.String(),
})

/**
 * Turns every failure into `{ error, code }`:
 *
 * - an `HttpError` thrown by a handler → its own code, message and status
 * - no matching route → 404 `not-found`
 * - Elysia body/query/param validation (and JSON parse) failures → 400
 *   `bad-request`; Elysia's default `{ type: 'validation', ... }` shape would
 *   otherwise break the contract
 * - anything else (bugs, driver errors) → logged here, then a generic 500
 *   `internal-error`. The real cause is never returned to the client.
 *
 * Mount it once in `main.ts` and every route inherits it.
 *
 * `.as('global')` is not decoration: without it the hook is registered as
 * `local` scope, and Elysia drops the local hooks of a plugin when the plugin
 * is `.use()`d — the handler would never run and failures would come back as
 * plain text (Elysia's `error.message` fallback) instead of `{ error, code }`.
 */
export const errorHandler = new Elysia({ name: 'errorHandler' })
  .onError(({ code, error, set, path }): ApiErrorBody => {
    if (error instanceof HttpError) {
      set.status = error.status
      return { error: error.message, code: error.code }
    }

    if (code === 'VALIDATION' || code === 'PARSE') {
      set.status = 400
      return { error: 'Request failed validation', code: 'bad-request' }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: 'Route not found', code: 'not-found' }
    }

    console.error(`Unhandled error on ${code} ${path}:`, error)
    set.status = 500
    return { error: 'Something went wrong', code: 'internal-error' }
  })
  .as('global')
