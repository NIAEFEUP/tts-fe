FROM node:16-alpine3.12

RUN mkdir -p /usr/src/tts-fe
WORKDIR /usr/src/tts-fe

COPY .*rc ./
COPY *.json ./
COPY .prettier* ./
COPY *.config.js ./

RUN npm install

COPY public/ public/
COPY src/ src/

EXPOSE $PORT
CMD ["npm", "start"]
