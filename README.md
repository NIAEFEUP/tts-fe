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
bun run contract:emit     # generate the Prisma contract (required)
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
copy — edit it directly. The only value you must change for local dev is your NMEC:

```bash
# apps/backend/.env
ADMIN_UP=up202012345
```

The frontend needs no `.env` for local dev. Validate with `bunx varlock load` from inside the app.

## Notes

- After editing `apps/backend/src/infrastructure/database/contract.prisma`, re-run
  `bun run contract:emit` in `apps/backend`.
- `bun run build` in the frontend type-checks against the backend and needs the contract above
  to exist.

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
