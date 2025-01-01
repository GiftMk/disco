import type {
	CreateVideoResponse,
	MutationCreateVideoArgs,
} from '../../generated/graphql'
import { tempFile } from '../../lib/tempFile'
import { createVideo } from '../../lib/video/createVideo'
import { pubsub } from '../../pubsub'
import type { ServerContext } from '../../serverContext'
import { uploadToS3 } from '../s3-utils/uploadToS3'
import fs from 'node:fs'
import { env } from '../../environment'
import { handleNormalisation } from './handleNormalisation'
import { handleResize } from './handleResize'
import { downloadAssets } from './downloadAssets'
import { generateFilename } from '../../lib/generateFilename'
import { GraphQLError } from 'graphql'

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
	const audioPath = tempFile(audioFilename)
	const imagePath = tempFile(imageFilename)
	const outputFilename = generateFilename('mp4')
	const outputPath = tempFile(outputFilename)

	if (env.USE_S3) {
		const downloadResult = await downloadAssets({
			s3Client,
			audioFilename,
			audioPath,
			imageFilename,
			imagePath,
		})

		if (downloadResult.isFailure) {
			throw new GraphQLError(downloadResult.error)
		}
	}

	const results = await Promise.all([
		handleNormalisation(
			Boolean(enableAudioNormalisation),
			audioPath,
			normaliseAudioSettings ?? undefined,
		),
		handleResize(imagePath),
	])

	const failedResults = results.filter(r => r.isFailure)

	if (failedResults.length) {
		const message = failedResults.map(r => r.error).join(', ')

		throw new GraphQLError(message)
	}

	const [normalisationResult, resizeResult] = results

	createVideo({
		audioPath: normalisationResult.value,
		imagePath: resizeResult.value,
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
