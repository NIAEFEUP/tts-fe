ARG TTS_FE_VARS_METHOD=dotenv

# build
FROM node:21-alpine3.19 AS build

RUN mkdir -p /usr/src/tts-fe
WORKDIR /usr/src/tts-fe

# Install protobuf compiler
RUN apk update
RUN apk add --no-cache protoc git

COPY .*rc ./
COPY *.json ./
COPY .prettier* ./
COPY *.config.js ./
COPY *.config.ts ./

RUN npm install

COPY public/ public/
COPY src/ src/
COPY index.html ./

RUN git init
RUN git submodule init
RUN git submodule update

COPY ./tts-protobufs/ ./tts-protobufs

# dev
FROM build AS dev

EXPOSE $PORT

CMD ["npm", "run", "dev"]

# prod-build-with-dotenv
FROM build AS prod-build-with-dotenv

ARG TTS_FE_DOTENV_FILE=.env.production
COPY ${TTS_DOTENV_FILE} .env.production

# prod-build-with-var
FROM build AS prod-build-with-content-var

ARG TTS_FE_VARS_CONTENT
RUN echo "${TTS_FE_VARS_CONTENT}" | base64 -d > .env.production

# prod-build
FROM prod-build-with-${TTS_FE_VARS_METHOD} AS prod-build

COPY --from=build /usr/src/tts-fe/tts-protobufs ./tts-protobufs

RUN npm run build

# prod
FROM nginx:alpine AS prod

COPY --from=prod-build /usr/src/tts-fe/build /usr/share/nginx/html
COPY nginx.tts.conf /etc/nginx/conf.d/default.conf
