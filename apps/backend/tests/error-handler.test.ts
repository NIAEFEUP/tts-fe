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

const get = async (path: string) => {
  const response = await app.handle(new Request(`http://localhost${path}`))
  return {
    status: response.status,
    contentType: response.headers.get('content-type') ?? '',
    body: (await response.json()) as unknown,
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

test('Elysia validation failures use the same shape', async () => {
  const valid = await get('/validated?year=2025')
  assert.equal(valid.status, 200)
  assert.deepEqual(valid.body, { year: '2025' })

  const invalid = await get('/validated')
  assert.equal(invalid.status, 400)
  assert.deepEqual(invalid.body, { error: 'Request failed validation', code: 'bad-request' })
})

test('unexpected errors are logged server-side and never leaked', async () => {
  const logged: string[] = []
  const consoleError = console.error
  console.error = (...args: unknown[]) => logged.push(args.map(String).join(' '))

  let response: { status: number; contentType: string; body: unknown }
  try {
    response = await get('/boom')
  } finally {
    console.error = consoleError
  }

  assert.equal(response.status, 500)
  assert.deepEqual(response.body, { error: 'Something went wrong', code: 'internal-error' })

  // The cause lands in the logs...
  assert.equal(logged.length, 1)
  assert.match(logged[0], /ECONNREFUSED/)
  // ...and never in the response body.
  assert.equal(JSON.stringify(response.body).includes('ECONNREFUSED'), false)
})

test('an unmatched route returns 404 not-found instead of a 500', async () => {
  const { status, body } = await get('/faculties')

  assert.equal(status, 404)
  assert.deepEqual(body, { error: 'Route not found', code: 'not-found' })
})
