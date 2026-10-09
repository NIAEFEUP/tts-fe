# Build context must be the repository root (the Bun lockfile lives there):
#   docker build -f apps/frontend/Dockerfile --target prod .
ARG TTS_FE_VARS_METHOD=dotenv

# build
FROM docker.io/oven/bun:1-alpine AS build

WORKDIR /usr/src/tts

COPY package.json bun.lock tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/
COPY apps/backend/package.json apps/backend/

RUN bun install --frozen-lockfile --ignore-scripts --filter tts-fe --filter tts-be

# The frontend type-checks against the backend's emitted declarations (`tts-be`),
# which need the generated Prisma contract.
COPY apps/backend/bunfig.toml apps/backend/tsconfig*.json apps/backend/prisma.config.ts apps/backend/.env.schema apps/backend/
COPY apps/backend/src/ apps/backend/src/
COPY apps/backend/migrations/ apps/backend/migrations/

RUN cd apps/backend && bun run contract:emit

WORKDIR /usr/src/tts/apps/frontend

COPY apps/frontend/bunfig.toml apps/frontend/tsconfig*.json apps/frontend/.env.schema ./
COPY apps/frontend/*.config.js apps/frontend/*.config.ts ./
COPY apps/frontend/public/ public/
COPY apps/frontend/src/ src/
COPY apps/frontend/tests/ tests/
COPY apps/frontend/index.html ./

# dev
FROM build AS dev

ENV PORT=3100
EXPOSE $PORT

CMD ["bun", "run", "dev"]

# prod-build-with-dotenv
FROM build AS prod-build-with-dotenv

ARG TTS_FE_DOTENV_FILE=apps/frontend/.env
COPY ${TTS_FE_DOTENV_FILE} .env

# prod-build-with-var
FROM build AS prod-build-with-content-var

ARG TTS_FE_VARS_CONTENT
RUN echo "${TTS_FE_VARS_CONTENT}" | base64 -d > .env

# prod-build
FROM prod-build-with-${TTS_FE_VARS_METHOD} AS prod-build
RUN bun run build

# prod
FROM docker.io/nginx:alpine AS prod

COPY --from=prod-build /usr/src/tts/apps/frontend/build /usr/share/nginx/html
COPY apps/frontend/nginx.tts.conf /etc/nginx/conf.d/default.conf
