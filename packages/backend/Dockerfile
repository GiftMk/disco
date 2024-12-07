FROM node:23-alpine

RUN apk update
RUN apk add --no-cache ffmpeg

WORKDIR /backend

COPY src ./src
COPY package.json ./
COPY schema.graphql ./
COPY tsconfig.json ./

RUN npm install
RUN npm run build
RUN rm -rf node_modules

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start"]

