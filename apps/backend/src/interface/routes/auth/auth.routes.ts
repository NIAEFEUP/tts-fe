import { Elysia, t } from 'elysia'

// The database client and the connect helper are injected through the Elysia
// context by the composition root (`src/main.ts`). Describing the shape
// structurally here avoids importing `@/infrastructure/**` from the interface
// layer, which the project's clean-architecture lint rule forbids.
type DbUser = {
  id: string
  name: string
  email: string | null
  role: string
}

type InjectedDb = {
  orm: {
    public: {
      User: {
        where(query: { id: string }): { first(): Promise<DbUser | null> }
        create(data: { id: string; name: string; email: string }): Promise<DbUser>
      }
    }
  }
}

type AuthContext = {
  db: InjectedDb
  connectDatabase(): Promise<void>
}

export const authRoutes = new Elysia({ prefix: '/auth' })
  .post(
    '/login',
    async (context) => {
      const { body, set } = context
      const { db, connectDatabase } = context as unknown as AuthContext
      const { username, password } = body

      try {
        const params = new URLSearchParams()
        params.append('p_user', username)
        params.append('p_pass', password)

        const response = await fetch('https://sigarra.up.pt/feup/pt/vld_validacao.validacao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
          body: params,
          redirect: 'manual',
        })

        const rawCookies = response.headers.get('set-cookie') || ''

        // Sigarra login mechanism:
        // Successful login yields HTTP 200 + <meta http-equiv="Refresh" ...> + SI_SECURITY and SI_SESSION cookies.
        // Failed login yields HTTP 200 + HTML page + HTTP_SESSION cookie only (no SI_SECURITY).
        if (!rawCookies.includes('SI_SECURITY')) {
          set.status = 401
          return { error: 'Invalid Sigarra credentials' }
        }

        // -------------------------------------------------------------
        // Persist / update the user via the injected database client
        // -------------------------------------------------------------
        await connectDatabase()

        const existingUser = await db.orm.public.User.where({ id: username }).first()
        let dbUser = existingUser

        if (!dbUser) {
          dbUser = await db.orm.public.User.create({
            id: username,
            name: 'Student', // Can be enriched from Sigarra later
            email: `${username}@fe.up.pt`,
            // `role` defaults to UserRole.USER
          })
        }

        return {
          message: 'Login successful via Sigarra and saved to Database',
          user: {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          },
          token: rawCookies,
        }
      } catch (error) {
        console.error('Sigarra auth error: ', error)
        set.status = 500
        return { error: 'Failed to contact Sigarra servers or database' }
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String(),
      }),
    },
  )
  .get(
    '/me',
    async (context) => {
      const { query, set } = context
      const { db, connectDatabase } = context as unknown as AuthContext

      // For testing purposes, pass ?userId=up... to inspect their DB record
      const userId = query.userId
      if (!userId) {
        return {
          signed: true,
          username: 'up_live_session',
          name: 'Authenticated UP.PT Student',
          eligible_exchange: true,
          role: 'USER',
        }
      }

      await connectDatabase()
      const user = await db.orm.public.User.where({ id: userId }).first()
      if (!user) {
        set.status = 404
        return { error: 'User not found in DB' }
      }

      return {
        signed: true,
        username: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    },
    {
      query: t.Optional(
        t.Object({
          userId: t.Optional(t.String()),
        }),
      ),
    },
  )
