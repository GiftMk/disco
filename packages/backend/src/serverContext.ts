import { S3Client } from '@aws-sdk/client-s3'
import { env } from './environment'
import type { CreatingVideoResponse } from './generated/graphql'
import { createPubSub, type PubSub } from 'graphql-yoga'
import type { AssetRepository } from './lib/assets/AssetRepository'
import { S3Repository } from './lib/assets/S3Repository'
import { FileSystemRepository } from './lib/assets/FileSystemRepository'
import path from 'node:path'
import os from 'node:os'
import { TempDirectoryRepository } from './lib/tempFiles/TempDirectoryRepository'

export type PubSubProps = {
	creatingVideo: [trackingId: string, payload: CreatingVideoResponse]
}

const pubSub = createPubSub<PubSubProps>()

export type ServerContext = {
	pubSub: PubSub<PubSubProps>
	assetRepository: AssetRepository
	tempDirectoryRepository: TempDirectoryRepository
}

const getAssetRepository = (
	s3Client: S3Client,
	isProd: boolean,
): AssetRepository => {
	if (isProd) {
		return new S3Repository(s3Client, env.INPUT_BUCKET, env.OUTPUT_BUCKET)
	}
	return new FileSystemRepository(
		path.join('assets', 'inputs'),
		path.join('assets', 'outputs'),
	)
}

const getTempDirectoryRepository = (
	isProd: boolean,
): TempDirectoryRepository => {
	return new TempDirectoryRepository(
		isProd ? os.tmpdir() : path.join('assets', 'tmp'),
	)
}

export const getServerContext = async (): Promise<ServerContext> => {
	const s3Client = new S3Client({ region: env.AWS_REGION })

	return {
		assetRepository: getAssetRepository(s3Client, env.isProd),
		tempDirectoryRepository: getTempDirectoryRepository(env.isProd),
		pubSub,
	}
}
