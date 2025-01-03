import { S3Client } from '@aws-sdk/client-s3'
import { env } from './environment'
import type { CreatingVideoResponse } from './generated/graphql'
import { createPubSub, type PubSub } from 'graphql-yoga'

type PubSubProps = {
	creatingVideo: [trackingId: string, payload: CreatingVideoResponse]
	ping: [pongId: string, payload: string]
}

const pubSub = createPubSub<PubSubProps>()

type S3Context = {
	client: S3Client
	uploadBucket: string
	downloadBucket: string
}

export type ServerContext = {
	s3: S3Context
	pubSub: PubSub<PubSubProps>
}

export const getServerContext = async (): Promise<ServerContext> => ({
	s3: {
		client: new S3Client({ region: env.AWS_REGION }),
		uploadBucket: env.INPUT_BUCKET,
		downloadBucket: env.OUTPUT_BUCKET,
	},
	pubSub,
})
