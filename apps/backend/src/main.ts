import { node } from '@elysiajs/node'
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { pathToFileURL } from 'node:url'
import { errorHandler } from '@/interface/middleware/error-handler'
import { healthRoutes } from '@/interface/routes/health.routes'
import { facultyRoutes } from '@/interface/routes/faculties.routes'
import { createRepositories } from '@/infrastructure/database/repositories'
import { db } from '@/infrastructure/database/prisma'

/**
 * Dependencies the interface layer receives from the composition root. Every
 * one can be overridden by a test, which is what keeps `tests/` free of a
 * database: pass a fake and the whole app still boots through `createApp()`.
 */
export type AppDependencies = {
  repositories: Partial<ReturnType<typeof createRepositories>>
}

export function createApp(dependencies: Partial<AppDependencies> = {}) {
  const defaults = createRepositories(db)

  return (
    new Elysia({ adapter: 'Bun' in globalThis ? undefined : node() })
      // Composition root: the interface layer gets its dependencies from the
      // context and never imports `@/infrastructure/**` itself, which the
      // clean-architecture lint rule in `.oxlintrc.json` forbids. Constructing
      // the repository does not connect — the client is lazy — so `createApp()`
      // stays usable in tests without a database.
      .decorate('repositories', {
        ...defaults,
        ...dependencies.repositories,
      })
      .use(cors())
      .use(errorHandler)
      .use(healthRoutes)
      .use(facultyRoutes)
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
