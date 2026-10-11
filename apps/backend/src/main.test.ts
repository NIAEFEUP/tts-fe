import { describe, expect, it } from 'bun:test'
import { createApp } from './main'

describe('app composition', () => {
  it('wires routes without decorator conflicts', async () => {
    const app = createApp()

    const health = await app.handle(new Request('http://localhost/health'))
    const root = await app.handle(new Request('http://localhost/'))

    expect(health.status).toBe(200)
    expect(root.status).toBe(200)
    expect(await root.json()).toEqual({ message: 'Hello from tts-be!' })
  })
})
