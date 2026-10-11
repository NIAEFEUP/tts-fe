import { Elysia, t, ElysiaCustomStatusResponse, ValidationError } from 'elysia'

import type { ApiErrorBody } from '@/interface/errors/errors'
import { ErrorCode, VALIDATION_ERROR_MESSAGE, genericErrorForStatus, HttpError } from '@/interface/errors/errors'

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
 * - a route answering with Elysia's `throw status(401)` → its status, with the
 *   code derived from it (or the route's own `{ error, code }`, if it threw one)
 * - no matching route → 404 `not-found`
 * - a route failing its own `response` schema → logged, then a generic 500
 *   `internal-error`: a server bug, never the caller's 400
 * - Elysia body/query/param validation (and JSON parse) failures → 422
 *   `validation-error`; Elysia's default `{ type: 'validation', ... }` shape
 *   would otherwise break the contract
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

    // A route that answers with Elysia's `throw status(401)` / `status(403)`
    // reaches the hook as an `ElysiaCustomStatusResponse` with a numeric code
    // and no `Error` instance. Nothing below matches a number, so without this
    // branch every deliberate 401/403/404 would be reported as a 500.
    if (error instanceof ElysiaCustomStatusResponse) {
      const status = error.code
      set.status = status

      // A route may throw `status(403, { error, code })` with its own body — it
      // already follows the contract, so keep it. Anything else was a status
      // thrown bare, so the code is derived from the status.
      const isApiErrorBody =
        typeof error.response === 'object' &&
        error.response !== null &&
        'error' in error.response &&
        'code' in error.response

      return isApiErrorBody ? (error.response as ApiErrorBody) : genericErrorForStatus(status)
    }

    if (code === 'VALIDATION' || code === 'PARSE') {
      // Elysia lumps caller input failures and a route failing its own
      // `response` schema under one `VALIDATION` code. The first is the
      // caller's fault and a 422 they can act on; the second is our bug, so it
      // is logged and answered with a 500 instead of a 4xx nobody can fix.
      if (error instanceof ValidationError && error.type === 'response') {
        console.error(`Response validation failed on ${path}:`, error)
        set.status = 500
        return { error: SERVER_FAULT_MESSAGE, code: ErrorCode.internalError }
      }

      // 422, not 400: the request did not match the declared schema, which is
      // a different failure from a route deciding `httpError.badRequest` that
      // its input is semantically wrong. Same body `genericErrorForStatus`
      // answers for a thrown `status(422)`, so the two cannot diverge.
      set.status = 422
      return { error: VALIDATION_ERROR_MESSAGE, code: ErrorCode.validationError }
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
