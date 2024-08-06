FROM node:21-alpine3.19

RUN mkdir -p /usr/src/tts-fe
WORKDIR /usr/src/tts-fe

COPY .*rc ./
COPY *.json ./
COPY .prettier* ./
COPY *.config.js ./
COPY *.config.ts ./

RUN npm install

COPY public/ public/
COPY src/ src/
COPY index.html ./

EXPOSE $PORT

CMD ["npm", "run", "dev"]
