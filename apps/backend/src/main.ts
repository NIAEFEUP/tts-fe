import { node } from '@elysiajs/node'
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { pathToFileURL } from 'node:url'
import { errorHandler } from '@/interface/middleware/error-handler'
import { loadAuthConfig } from '@/core/config/auth'
import { openapiPlugin } from '@/interface/plugins/openapi'
import { healthRoutes } from '@/interface/routes/health.routes'
import { apiRoutes } from '@/interface/routes/api.routes'
import { authRoutes } from '@/interface/routes/auth/auth.routes'
import { authCompatRoutes } from '@/interface/routes/auth/auth-compat.routes'
import { createRepositories } from '@/infrastructure/database/repositories'
import { db } from '@/infrastructure/database/prisma'
import { createSessionRepository } from '@/infrastructure/database/repositories/session.repository'
import { createUserRepository } from '@/infrastructure/database/repositories/user.repository'
import { createSigarraOidcProvider } from '@/infrastructure/external/sigarra-oidc.provider'
import { createSigarraDirectAuth } from '@/infrastructure/external/sigarra-direct-auth'
import type { AuthConfig } from '@/core/config/auth'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { UserRepository } from '@/domain/ports/user.repository'

/**
 * Dependencies the interface layer receives from the composition root. Every
 * one can be overridden by a test, which is what keeps `tests/` free of a
 * database: pass a fake and the whole app still boots through `createApp()`.
 */
export type AppDependencies = {
  repositories: Partial<ReturnType<typeof createRepositories>>
  auth: Partial<{
    config: AuthConfig
    users: UserRepository
    sessions: SessionRepository
  }>
}

export function createApp(dependencies: Partial<AppDependencies> = {}) {
  const defaults = createRepositories(db)
  const config = dependencies.auth?.config ?? loadAuthConfig()

  const users = dependencies.auth?.users ?? createUserRepository({ db })
  const sessions = dependencies.auth?.sessions ?? createSessionRepository({ db })
  const provider = createSigarraOidcProvider({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    redirectUri: config.redirectUri,
    authorizeEndpoint: config.authorizeEndpoint,
    tokenEndpoint: config.tokenEndpoint,
    userinfoEndpoint: config.userinfoEndpoint,
    scopes: config.scopes,
  })
  const sigarraDirect = createSigarraDirectAuth()

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
      // Credentialed CORS: the frontend sends the session cookie cross-origin
      // in dev (`:3100` → `:3000`), so the origin must be explicit.
      .use(cors({ origin: config.allowedOrigins, credentials: true }))
      .use(errorHandler)
      .use(healthRoutes)
      .use(openapiPlugin)
      .use(apiRoutes)
      .use(authRoutes({ provider, users, sessions, sigarraDirect, config }))
      .use(authCompatRoutes({ users, sessions, sigarraDirect, config }))
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
