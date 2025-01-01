FROM node:lts-alpine

RUN apk update
RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY src ./src
COPY package.json ./
COPY schema.graphql ./
COPY tsconfig.json ./

RUN npm install
RUN npm run build
RUN rm -rf node_modules

EXPOSE 8080

ENTRYPOINT ["npm", "start"]