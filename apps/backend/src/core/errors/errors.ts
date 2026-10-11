// The single error contract for the whole API.
//
// Every failing response — 400s, 401s, 404s, unexpected bugs — is normalized to
// this shape by the `onError` hook in `src/interface/middleware/error-handler.ts`:
//
//   { "error": "Faculty FEUP was not found", "code": "faculty-not-found" }
//
// `code` is stable and machine-readable so clients can branch on it (the
// frontend maps codes to copy, e.g. via `exchangeErrorToText` in
// `apps/frontend/src/utils/error.ts` — note it must read `.code`, not `.error`,
// once migrated), while `error` is the human-readable message.
// Nothing internal (stack traces, SQL, upstream errors) ever leaks.

/** The wire shape of every error response. */
export type ApiErrorBody = {
  error: string
  code: string
}

/**
 * Codes for the generic cases, so they are spelled consistently everywhere.
 *
 * Domain-specific codes are plain kebab-case strings
 * (`new HttpError('faculty-not-found', ..., 404)`) and do not need to be added
 * here — this map only exists for the cases every endpoint can hit.
 *
 * Every code's status is set at the throw site (see the factories below), so
 * the factories are the source of truth. The `code` string itself is not
 * validated — a typo produces a wrong `code` on the wire, not a status change.
 */
export const ErrorCode = {
  badRequest: 'bad-request',
  unauthorized: 'unauthorized',
  forbidden: 'forbidden',
  notFound: 'not-found',
  conflict: 'conflict',
  validationError: 'validation-error',
  internalError: 'internal-error',
} as const

/**
 * Throw this from any handler; the global `onError` hook turns it into an
 * `ApiErrorBody` with `status` as the HTTP status.
 *
 * Prefer the factories in `httpError` over calling the constructor directly.
 */
export class HttpError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number = 500) {
    super(message)
    this.name = 'HttpError'
    this.code = code
    this.status = status
  }
}

/** Factories for the generic cases: `throw httpError.notFound(\`Faculty ${acronym} not found\`)`. */
export const httpError = {
  badRequest: (message = 'Invalid request') => new HttpError(ErrorCode.badRequest, message, 400),
  unauthorized: (message = 'Authentication required') => new HttpError(ErrorCode.unauthorized, message, 401),
  forbidden: (message = 'Not allowed') => new HttpError(ErrorCode.forbidden, message, 403),
  notFound: (message = 'Resource not found') => new HttpError(ErrorCode.notFound, message, 404),
  conflict: (message = 'Resource conflicts with its current state') => new HttpError(ErrorCode.conflict, message, 409),
  internal: (message = 'Something went wrong') => new HttpError(ErrorCode.internalError, message, 500),
}

/**
 * Message for a request that failed schema validation — the caller's fault, so
 * the body says what to fix rather than worse. Shared with
 * `error-handler.ts`, where the same failure is answered from Elysia's
 * `VALIDATION` code instead of a thrown status.
 */
export const VALIDATION_ERROR_MESSAGE = 'Request failed validation'

/**
 * The body for `throw status(...)` — Elysia's custom status response — when the
 * route threw a status without a body of its own.
 *
 * Elysia reports those to the `onError` hook as a numeric code with no `Error`
 * instance, so the route never gets to describe its own failure. Mapping the
 * status here keeps `throw status(404)` indistinguishable from
 * `throw httpError.notFound()`. 422 maps to the same `{ error, code }` as
 * Elysia's own `VALIDATION` failures, so a route that throws `status(422)`
 * cannot produce a different shape for the same failure. Statuses we have no
 * code for keep their own status but answer `internal-error`, since an unmapped
 * 5xx is a bug and an unmapped 4xx is at least the caller's fault.
 */
export function genericErrorForStatus(status: number): ApiErrorBody {
  let error: HttpError | undefined

  switch (status) {
    case 400:
      error = httpError.badRequest()
      break
    case 401:
      error = httpError.unauthorized()
      break
    case 403:
      error = httpError.forbidden()
      break
    case 404:
      error = httpError.notFound()
      break
    case 409:
      error = httpError.conflict()
      break
    case 422:
      error = new HttpError(ErrorCode.validationError, VALIDATION_ERROR_MESSAGE, 422)
      break
  }

  if (!error) {
    console.error(`Unhandled status ${status} with no error body`)
    return { error: 'Request failed', code: ErrorCode.internalError }
  }

  return { error: error.message, code: error.code }
}
