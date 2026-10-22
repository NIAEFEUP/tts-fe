import assert from 'node:assert/strict'
import { test } from 'node:test'

import { createApp } from '@/main'

// Regression guard for issue #823 (I-2): the frontend talks to this backend
// cross-origin in dev (`localhost:3100` → `localhost:3000`) with credentials,
// so the two things it relies on are that `GET /health` answers and that CORS
// echoes the frontend origin. Both are wired in `main.ts`; this drives the real
// app through `createApp().handle(request)` — no listener, no database.
//
// `node:test` + `node:assert` are used (like `error-handler.test.ts`) so the
// file typechecks under `bun run typecheck` without a Bun types dependency.

const app = createApp()

const preflight = (origin: string) =>
  app.handle(
    new Request('http://localhost:3000/api/v1/auth/me', {
      method: 'OPTIONS',
      headers: {
        Origin: origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'content-type',
      },
    }),
  )

test('GET /health answers for the frontend readiness check', async () => {
  const response = await app.handle(new Request('http://localhost:3000/health'))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { status: 'ok' })
})

test('CORS allows the frontend origin and permits credentials', async () => {
  const response = await preflight('http://localhost:3100')

  assert.equal(response.status, 204)
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:3100')
  assert.equal(response.headers.get('access-control-allow-credentials'), 'true')
})

test('CORS does not allow an unlisted origin', async () => {
  const response = await preflight('http://evil.example')

  assert.equal(response.headers.get('access-control-allow-origin'), null)
})
