# TTS — Time Table Selector

Bun workspace monorepo. Two apps:

| Path            | Stack                              | Dev URL               |
| --------------- | ---------------------------------- | --------------------- |
| `apps/backend`  | Bun + Elysia + Prisma 8            | http://localhost:3000 |
| `apps/frontend` | React + Vite                       | http://localhost:3100 |

## Requirements

- [Bun](https://bun.sh) >= 1.4
- Docker

## Setup (first time)

```bash
# 1. install (from the repo root)
bun install

# 2. start PostgreSQL (127.0.0.1:5434, tts/tts/tts) and wait for it
docker compose up -d --wait

# 3. create your backend env (git-ignored), then set ADMIN_UP to your own NMEC ("up" number)
cp apps/backend/.env.schema apps/backend/.env

# 4. prepare + seed the backend database
cd apps/backend
bun run contract:emit     # generate the Prisma contract (required; the output is git-ignored)
bun run db:init           # create the tables
bun run db:seed:demo      # seed catalog + demo data; makes ADMIN_UP an admin
```

## Run

```bash
# terminal 1 — backend
cd apps/backend && bun run dev     # http://localhost:3000

# terminal 2 — frontend
cd apps/frontend && bun run dev    # http://localhost:3100
```

Open <http://localhost:3100>. Both servers hot-reload on save.

That's the whole daily loop: `docker compose up -d` (if stopped) + the two `bun run dev`.

## Environment variables

Both apps load their config from a committed `.env.schema` (with working defaults), validated by
[varlock](https://varlock.dev). The backend `apps/backend/.env` created in step 3 is your local
copy — edit it directly. For local dev you'll want your NMEC and the Sigarra credentials the dev
login uses:

```bash
# apps/backend/.env
ADMIN_UP=up202012345          # your NMEC — becomes the seeded admin account
ADMIN_ROLE=ADMIN              # USER | ADMIN | SUPERUSER
SIGARRA_USERNAME=202012345    # Sigarra login used by the dev login
SIGARRA_PASSWORD=…
```

The frontend needs no `.env` for local dev. Validate with `bunx varlock load` from inside the app.

## Authentication

Two flows, selected by environment:

- **Local dev — username/password.** `POST /api/v1/auth/dev-login` validates
  `SIGARRA_USERNAME`/`SIGARRA_PASSWORD` against Sigarra and issues a cookie session. Enabled by
  `DEV_LOGIN_ENABLED` (on by default, forced off when `NODE_ENV=production`). The frontend shows
  this button when `VITE_APP_FEDERATED_AUTH=false` (the default).
- **Production — Sigarra OIDC.** `GET /api/v1/auth/login` redirects to Sigarra; the callback
  exchanges the code, upserts the user and sets the same httpOnly `session` cookie. Set
  `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` / `OIDC_REDIRECT_URI` / `FRONTEND_URL` /
  `ALLOWED_ORIGINS` on the backend (see `apps/backend/.env.schema`) and
  `VITE_APP_FEDERATED_AUTH=true` on the frontend.

Roles are assigned by **seeding**, never by logging in: `db:seed:demo` creates the `ADMIN_UP`
account with `ADMIN_ROLE` and full admin scope. NMECs are stored as bare digits, so
`ADMIN_UP=up202207150` and `202207150` are the same account. The full API surface is in
[`apps/backend/docs/endpoints.md`](./apps/backend/docs/endpoints.md#1-auth).

## Notes

- After editing `apps/backend/src/infrastructure/database/contract.prisma`, re-run
  `bun run contract:emit` in `apps/backend`. `contract.json` and `contract.d.ts` are
  **generated artifacts and git-ignored**, so a fresh clone does not have them.
- `bun run build` in the frontend type-checks against the backend and needs the contract above
  to exist.
- CI (the `Code analysis` workflow) runs `bun install`, emits the contract, then
  typechecks the backend and frontend and lints on every PR — so a missing or stale
  generated client fails the build instead of silently misleading you.

## Troubleshooting

### `bun run typecheck` complains about missing models or unknown fields

`contract.json` and `contract.d.ts` are git-ignored, so a fresh clone — or a pull that
changed `contract.prisma` — leaves the generated Prisma client missing or stale. The
compiler then reports misleading errors such as `Cannot find module './contract.d.ts'`,
or `Property 'Occurrence' does not exist` / extraneous `occurrenceId` properties when the
client exists but predates a schema change. This is **not** a code bug.

Regenerate the client and retry:

```bash
cd apps/backend
bun run contract:emit
```

`bun run typecheck` now runs `contract:emit` first, so unless you invoked `tsc` directly
the client can't be stale. CI emits it too.

## Useful commands

```bash
# repo root
bun install
bun run lint
bun run format

# backend (apps/backend)
bun run dev, start, test, typecheck, lint
bun run contract:emit, db:init, db:update, db:seed, db:seed:demo, db:studio
bun run migration:plan -- --name <slug>, migrate

# frontend (apps/frontend)
bun run dev, build, preview, lint

# docker (from the repo root)
docker compose up -d --wait    # start the database
docker compose down            # stop (keeps data)
docker compose down -v         # stop and wipe data

# app images (from the repo root)
docker build --target backend-prod  -t tts-be .
docker build --target frontend-prod -t tts-fe .
```
