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

# ARG AWS_REGION
# ARG UPLOAD_BUCKET
# ARG DOWNLOAD_BUCKET

ENV AWS_REGION="ap-southeast-2"
ENV UPLOAD_BUCKET="foo"
ENV DOWNLOAD_BUCKET="bar"

EXPOSE 4000

ENTRYPOINT ["npm", "run", "start"]

