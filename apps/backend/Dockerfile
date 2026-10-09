# Build context must be the repository root (the Bun lockfile lives there):
#   docker build -f apps/backend/Dockerfile --target prod .

# deps
FROM docker.io/oven/bun:1-alpine AS deps

WORKDIR /usr/src/tts

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

RUN bun install --frozen-lockfile --ignore-scripts --filter tts-be

# build
FROM deps AS build

WORKDIR /usr/src/tts/apps/backend

COPY tsconfig.base.json /usr/src/tts/
COPY apps/backend/bunfig.toml apps/backend/tsconfig*.json apps/backend/prisma.config.ts apps/backend/.env.schema ./
COPY apps/backend/src/ src/
COPY apps/backend/migrations/ migrations/

# Generates src/infrastructure/database/contract.{json,d.ts} (git-ignored)
RUN bun run contract:emit

# dev
FROM build AS dev

ENV PORT=3000
EXPOSE $PORT

# `bun run dev` uses tsx, which needs Node (not in this image)
CMD ["bun", "--bun", "x", "varlock", "run", "--", "bun", "--watch", "--tsconfig-override", "tsconfig.lib.json", "src/main.ts"]

# prod-deps
FROM docker.io/oven/bun:1-alpine AS prod-deps

WORKDIR /usr/src/tts

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

RUN bun install --frozen-lockfile --ignore-scripts --production --filter tts-be

# prod
FROM docker.io/oven/bun:1-alpine AS prod

ENV NODE_ENV=production

WORKDIR /usr/src/tts/apps/backend

COPY --from=prod-deps /usr/src/tts/node_modules /usr/src/tts/node_modules
COPY --from=prod-deps /usr/src/tts/apps/backend/node_modules ./node_modules
COPY --from=build /usr/src/tts/tsconfig.base.json /usr/src/tts/
COPY --from=build /usr/src/tts/apps/backend/package.json /usr/src/tts/apps/backend/bunfig.toml /usr/src/tts/apps/backend/tsconfig*.json /usr/src/tts/apps/backend/.env.schema ./
# Includes the generated Prisma contract
COPY --from=build /usr/src/tts/apps/backend/src/ src/

USER bun

EXPOSE 3000

# Run under Bun directly (the `start` script needs tsx, which needs Node). The `@/` alias
# lives in tsconfig.lib.json, so point Bun at it. `--bun` makes varlock's `#!/usr/bin/env node`
# shebang run under Bun too.
CMD ["bun", "--bun", "x", "varlock", "run", "--", "bun", "--tsconfig-override", "tsconfig.lib.json", "src/main.ts"]
