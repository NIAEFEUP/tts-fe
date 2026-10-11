import { Elysia, t, ValidationError } from 'elysia'

import type { ApiErrorBody } from '@/core/errors/errors'
import { ErrorCode, HttpError } from '@/core/errors/errors'

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
 * Message for every 5xx, whatever the cause. A 5xx is a bug or a dependency
 * failing, so the body must not describe itself — the cause goes to the logs.
 */
const SERVER_FAULT_MESSAGE = 'Something went wrong'

/**
 * Turns every failure into `{ error, code }`:
 *
 * - an `HttpError` thrown by a handler → its own code, status and message
 * - an `HttpError` with a 5xx status → its code and status, but a fixed
 *   message plus a log of the real cause, since such a message is usually
 *   driver/internal text that must not reach the client
 * - no matching route → 404 `not-found`
 * - a route failing its own `response` schema → logged, then a generic 500
 *   `internal-error`: a server bug, never the caller's 400
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

      // `httpError.internal(message)` — and any other 5xx — carries its cause
      // in `message`, so the message is the unsafe part, not the code. Keep
      // the code (a stable, developer-authored identifier) and drop the rest.
      if (error.status >= 500) {
        console.error(`Unhandled error on ${code} ${path}:`, error)
        return { error: SERVER_FAULT_MESSAGE, code: error.code }
      }

      return { error: error.message, code: error.code }
    }

    if (code === 'VALIDATION' || code === 'PARSE') {
      // Elysia lumps caller input failures and a route failing its own
      // `response` schema under one `VALIDATION` code. The first is the
      // caller's fault and a 400 they can act on; the second is our bug, so it
      // is logged and answered with a 500 instead of a 400 nobody can fix.
      if (error instanceof ValidationError && error.type === 'response') {
        console.error(`Response validation failed on ${path}:`, error)
        set.status = 500
        return { error: SERVER_FAULT_MESSAGE, code: ErrorCode.internalError }
      }

      set.status = 400
      return { error: 'Request failed validation', code: ErrorCode.badRequest }
    }

    if (code === 'NOT_FOUND') {
      set.status = 404
      return { error: 'Route not found', code: ErrorCode.notFound }
    }

    console.error(`Unhandled error on ${code} ${path}:`, error)
    set.status = 500
    return { error: SERVER_FAULT_MESSAGE, code: ErrorCode.internalError }
  })
  .as('global')
