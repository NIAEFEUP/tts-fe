# Builds both apps from the repository root (the Bun lockfile lives here):
#   docker build --target backend-prod  -t tts-be .
#   docker build --target frontend-prod -t tts-fe .
# Targets: backend-dev, backend-prod, frontend-dev, frontend-prod
ARG TTS_FE_VARS_METHOD=dotenv

# deps
FROM docker.io/oven/bun:1-alpine AS deps

WORKDIR /usr/src/tts

COPY package.json bun.lock tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

RUN bun install --frozen-lockfile --ignore-scripts --filter tts-be --filter tts-fe

# backend-build
FROM deps AS backend-build

WORKDIR /usr/src/tts/apps/backend

COPY apps/backend/bunfig.toml apps/backend/tsconfig*.json apps/backend/prisma.config.ts apps/backend/.env.schema ./
COPY apps/backend/src/ src/
COPY apps/backend/migrations/ migrations/

# Generates src/infrastructure/database/contract.{json,d.ts} (git-ignored)
RUN bun run contract:emit

# backend-dev
FROM backend-build AS backend-dev

ENV PORT=3000
EXPOSE $PORT

# `bun run dev` uses tsx, which needs Node (not in this image)
CMD ["bun", "--bun", "x", "varlock", "run", "--", "bun", "--watch", "--tsconfig-override", "tsconfig.lib.json", "src/main.ts"]

# backend-prod-deps
FROM docker.io/oven/bun:1-alpine AS backend-prod-deps

WORKDIR /usr/src/tts

COPY package.json bun.lock ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/

RUN bun install --frozen-lockfile --ignore-scripts --production --filter tts-be

# backend-prod
FROM docker.io/oven/bun:1-alpine AS backend-prod

ENV NODE_ENV=production

WORKDIR /usr/src/tts/apps/backend

COPY --from=backend-prod-deps /usr/src/tts/node_modules /usr/src/tts/node_modules
COPY --from=backend-prod-deps /usr/src/tts/apps/backend/node_modules ./node_modules
COPY --from=backend-build /usr/src/tts/tsconfig.base.json /usr/src/tts/
COPY --from=backend-build /usr/src/tts/apps/backend/package.json /usr/src/tts/apps/backend/bunfig.toml /usr/src/tts/apps/backend/tsconfig*.json /usr/src/tts/apps/backend/.env.schema ./
# Includes the generated Prisma contract
COPY --from=backend-build /usr/src/tts/apps/backend/src/ src/

USER bun

EXPOSE 3000

# Run under Bun directly (the `start` script needs tsx, which needs Node). The `@/` alias
# lives in tsconfig.lib.json, so point Bun at it. `--bun` makes varlock's `#!/usr/bin/env node`
# shebang run under Bun too.
CMD ["bun", "--bun", "x", "varlock", "run", "--", "bun", "--tsconfig-override", "tsconfig.lib.json", "src/main.ts"]

# frontend-build
# The frontend type-checks against the backend's emitted declarations (`tts-be`),
# so it builds on top of backend-build (which has the generated Prisma contract).
FROM backend-build AS frontend-build

WORKDIR /usr/src/tts/apps/frontend

COPY apps/frontend/bunfig.toml apps/frontend/tsconfig*.json apps/frontend/.env.schema ./
COPY apps/frontend/*.config.js apps/frontend/*.config.ts ./
COPY apps/frontend/public/ public/
COPY apps/frontend/src/ src/
COPY apps/frontend/tests/ tests/
COPY apps/frontend/index.html ./

# frontend-dev
FROM frontend-build AS frontend-dev

ENV PORT=3100
EXPOSE $PORT

CMD ["bun", "run", "dev"]

# frontend-prod-build-with-dotenv
FROM frontend-build AS frontend-prod-build-with-dotenv

ARG TTS_FE_DOTENV_FILE=apps/frontend/.env
COPY ${TTS_FE_DOTENV_FILE} .env

# frontend-prod-build-with-content-var
FROM frontend-build AS frontend-prod-build-with-content-var

ARG TTS_FE_VARS_CONTENT
RUN echo "${TTS_FE_VARS_CONTENT}" | base64 -d > .env

# frontend-prod-build
FROM frontend-prod-build-with-${TTS_FE_VARS_METHOD} AS frontend-prod-build
RUN bun run build

# frontend-prod
FROM docker.io/nginx:alpine AS frontend-prod

COPY --from=frontend-prod-build /usr/src/tts/apps/frontend/build /usr/share/nginx/html
COPY apps/frontend/nginx.tts.conf /etc/nginx/conf.d/default.conf
