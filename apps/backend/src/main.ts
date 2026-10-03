import { node } from '@elysiajs/node'
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { pathToFileURL } from 'node:url'
import { healthRoutes } from '@/interface/routes/health.routes'
import { authRoutes } from '@/interface/routes/auth/auth.routes'
import { db, connectDatabase } from '@/infrastructure/database/prisma'

export function createApp() {
  return (
    new Elysia({ adapter: 'Bun' in globalThis ? undefined : node() })
      // Composition root: hand the interface layer its database dependencies so
      // it never has to import from `@/infrastructure/**` directly.
      .decorate('db', db)
      .decorate('connectDatabase', connectDatabase)
      .use(cors())
      .use(healthRoutes)
      .use(authRoutes)
      .get('/', () => ({ message: 'Hello from tts-be!' }))
  )
}

export type App = ReturnType<typeof createApp>

// `import.meta.main` only exists under Bun. When the production bundle runs
// under Node (`node dist/server.mjs`), detect the entry module via argv[1].
const isMain =
  'Bun' in globalThis
    ? (import.meta as { main?: boolean }).main === true
    : import.meta.url === pathToFileURL(process.argv[1] ?? '').href

if (isMain) {
  const port = Number(process.env.PORT) || 3000
  const app = createApp().listen(port)
  console.log(`Server running at http://localhost:${app.server?.port ?? port}`)
}
