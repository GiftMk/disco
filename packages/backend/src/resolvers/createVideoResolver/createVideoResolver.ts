import type {
	CreateVideoResponse,
	MutationCreateVideoArgs,
} from '../../generated/graphql'
import { generateFilename, filePath } from '../../lib/filePath'
import { createVideo } from '../../lib/video/createVideo'
import { pubsub } from '../../pubsub'
import type { ServerContext } from '../../serverContext'
import { uploadToS3 } from '../s3-utils/uploadToS3'
import fs from 'node:fs'
import { env } from '../../environment'
import { handleAudioNormalisation } from './handleAudioNormalisation'
import { handleImageSize } from './handleImageSize'
import { downloadAssets } from './downloadAssets'

export const createVideoResolver = async (
	_: unknown,
	args: MutationCreateVideoArgs,
	contextValue: ServerContext,
): Promise<CreateVideoResponse> => {
	const {
		audioFilename,
		imageFilename,
		enableAudioNormalisation,
		normaliseAudioSettings,
	} = args.input
	const s3Client = contextValue.s3.client
	const audioPath = filePath('inputs', audioFilename)
	const imagePath = filePath('inputs', imageFilename)
	const outputFilename = generateFilename('mp4')
	const outputPath = filePath('outputs', outputFilename)

	if (env.USE_S3) {
		await downloadAssets({
			s3Client,
			audioFilename,
			audioPath,
			imageFilename,
			imagePath,
		})
	}

	const normalisedAudioPath = await handleAudioNormalisation(
		Boolean(enableAudioNormalisation),
		audioPath,
		normaliseAudioSettings ?? undefined,
	)

	const resizedImagePath = await handleImageSize(imagePath)

	createVideo({
		audioPath: normalisedAudioPath ?? audioPath,
		imagePath: resizedImagePath,
		outputPath,
		onProgress: percentageComplete =>
			pubsub.publish('CREATING_VIDEO', {
				creatingVideo: { percentageComplete },
			}),
	}).then(async () => {
		if (env.USE_S3) {
			await uploadToS3(
				s3Client,
				outputFilename,
				fs.createReadStream(outputPath),
			)
		}

		pubsub.publish('CREATING_VIDEO', {
			creatingVideo: { percentageComplete: 100 },
		})
	})

	return { outputFilename }
}
