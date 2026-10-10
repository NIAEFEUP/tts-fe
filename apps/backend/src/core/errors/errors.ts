// The single error contract for the whole API.
//
// Every failing response — 400s, 401s, 404s, unexpected bugs — is normalized to
// this shape by the `onError` hook in `src/interface/middleware/error-handler.ts`:
//
//   { "error": "Faculty FEUP was not found", "code": "faculty-not-found" }
//
// `code` is stable and machine-readable so clients can branch on it (the
// frontend maps codes to copy, see `exchangeErrorToText` in
// `apps/frontend/src/utils/error.ts`), while `error` is the human-readable
// message. Nothing internal (stack traces, SQL, upstream errors) ever leaks.

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
 * there is no guessing: a typo'd code fails as a 500 rather than silently
 * succeeding as some other status.
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
