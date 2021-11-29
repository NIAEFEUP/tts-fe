FROM node:10.16.0-alpine

RUN mkdir -p /usr/src/tts-fe
WORKDIR /usr/src/tts-fe

COPY package*.json ./

RUN npm install

COPY public/ public/
COPY src/ src/

EXPOSE $PORT
CMD ["npm", "start"]
