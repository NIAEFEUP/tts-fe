import assert from 'node:assert/strict'
import { test } from 'node:test'

import { t } from 'elysia'

import { createApp } from '@/main'
import { ErrorCode, httpError, HttpError } from '@/core/errors/errors'

// The reference integration-test pattern from I-1: drive the real app through
// `createApp().handle(request)` — no listener, no fixtures, no database.
//
// Routes are appended to `createApp()` because the app does not own a failing
// route yet; the faculties endpoints (the other half of I-1) will test their
// own errors this same way. `createApp()` touches no database — dependencies
// are injected per route — so this runs on a bare checkout.
//
// `node:test` + `node:assert` are used instead of `bun:test` so the same file
// typechecks under `bun run typecheck` without a Bun types dependency.

const app = createApp()
  .get('/ok', () => ({ message: 'Hello from tts-be!' }))
  .get('/thrown', () => {
    throw httpError.notFound('Faculty FEUP was not found')
  })
  .get('/domain-code', () => {
    throw new HttpError('faculty-not-found', 'Faculty with acronym FAKE was not found', 404)
  })
  .get('/generic-code', () => {
    throw httpError.badRequest('page_size must be a positive integer')
  })
  .get('/validated', ({ query }) => ({ year: query.year }), { query: t.Object({ year: t.String() }) })
  .get('/boom', () => {
    throw new Error('connect ECONNREFUSED 127.0.0.1:5432')
  })
  .get('/driver-failure', () => {
    throw new HttpError('db-timeout', 'connect ETIMEDOUT 127.0.0.1:5432', 503)
  })
  .get('/internal-factory', () => {
    throw httpError.internal('connect ECONNREFUSED 127.0.0.1:5432')
  })
  .get('/bad-response', () => ({ id: 'not-a-number' }) as unknown as { id: number }, {
    response: t.Object({ id: t.Number() }),
  })

const get = async (path: string) => {
  const response = await app.handle(new Request(`http://localhost${path}`))
  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body: (await response.json()) as unknown,
  }
}

type HttpResult = Awaited<ReturnType<typeof get>>

/** Runs `fn` with `console.error` captured, for the branches that log. */
const captureConsole = async (fn: () => Promise<HttpResult>) => {
  const logged: string[] = []
  const consoleError = console.error
  console.error = (...args: unknown[]) => logged.push(args.map(String).join(' '))

  try {
    return { response: await fn(), logged }
  } finally {
    console.error = consoleError
  }
}

test('a successful response is left untouched', async () => {
  const { status, contentType, body } = await get('/ok')

  assert.equal(status, 200)
  assert.match(contentType, /^application\/json/)
  assert.deepEqual(body, { message: 'Hello from tts-be!' })
})

test('routes that never fail keep working', async () => {
  const { status } = await get('/health')

  assert.equal(status, 200)
})

test('a thrown HttpError becomes { error, code } with the right status', async () => {
  const { status, contentType, body } = await get('/thrown')

  assert.equal(status, 404)
  assert.match(contentType, /^application\/json/)
  assert.deepEqual(body, { error: 'Faculty FEUP was not found', code: 'not-found' })
})

test('a domain code keeps its own status instead of failing as a 500', async () => {
  const { status, body } = await get('/domain-code')

  assert.equal(status, 404)
  assert.deepEqual(body, {
    error: 'Faculty with acronym FAKE was not found',
    code: 'faculty-not-found',
  })
})

test('the generic factories map to their documented statuses', async () => {
  const { status, body } = await get('/generic-code')

  assert.equal(status, 400)
  assert.deepEqual(body, { error: 'page_size must be a positive integer', code: ErrorCode.badRequest })
})

test("input validation failures are the caller's fault: 400 bad-request", async () => {
  const valid = await get('/validated?year=2025')
  assert.equal(valid.status, 200)
  assert.deepEqual(valid.body, { year: '2025' })

  const invalid = await get('/validated')
  assert.equal(invalid.status, 400)
  assert.deepEqual(invalid.body, { error: 'Request failed validation', code: ErrorCode.badRequest })
})

test('a route failing its own response schema is a logged 500, not a 400', async () => {
  const { response, logged } = await captureConsole(() => get('/bad-response'))

  assert.equal(response.status, 500)
  assert.deepEqual(response.body, { error: 'Something went wrong', code: ErrorCode.internalError })
  assert.equal(logged.length, 1)
  assert.match(logged[0], /Response validation failed/)
})

test('unexpected errors are logged server-side and never leaked', async () => {
  const { response, logged } = await captureConsole(() => get('/boom'))

  assert.equal(response.status, 500)
  assert.deepEqual(response.body, { error: 'Something went wrong', code: ErrorCode.internalError })

  // The cause lands in the logs...
  assert.equal(logged.length, 1)
  assert.match(logged[0], /ECONNREFUSED/)
  // ...and never in the response body.
  assert.equal(JSON.stringify(response.body).includes('ECONNREFUSED'), false)
})

test('a 5xx HttpError keeps its status and code but not its message', async () => {
  const { response, logged } = await captureConsole(() => get('/driver-failure'))

  assert.equal(response.status, 503)
  assert.deepEqual(response.body, { error: 'Something went wrong', code: 'db-timeout' })
  assert.equal(logged.length, 1)
  assert.match(logged[0], /ETIMEDOUT/)
})

test('httpError.internal collapses to internal-error and still logs', async () => {
  const { response, logged } = await captureConsole(() => get('/internal-factory'))

  assert.equal(response.status, 500)
  assert.deepEqual(response.body, { error: 'Something went wrong', code: ErrorCode.internalError })
  assert.equal(logged.length, 1)
  assert.match(logged[0], /ECONNREFUSED/)
})

test('an unmatched route returns 404 not-found instead of a 500', async () => {
  const { status, body } = await get('/faculties')

  assert.equal(status, 404)
  assert.deepEqual(body, { error: 'Route not found', code: ErrorCode.notFound })
})
