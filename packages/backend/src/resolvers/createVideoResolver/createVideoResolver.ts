import type {
	CreateVideoPayload,
	MutationCreateVideoArgs,
} from '../../generated/graphql'
import { tempFile } from '../../utils/tempFile'
import { createVideo } from '../../lib/video/createVideo'
import type { ServerContext } from '../../serverContext'
import { uploadToS3 } from '../../utils/uploadToS3'
import fs from 'node:fs'
import { downloadAssets } from './downloadAssets'
import { generateFilename } from '../../utils/generateFilename'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import { defaultSettings } from '../../lib/audio/defaultSettings'
import { EitherAsync } from 'purify-ts'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'
import type { NormaliseAudioError } from '../../lib/audio/NormaliseAudioError'
import type { ResizeImageError } from '../../lib/image/ResizeImageError'
import { randomUUID } from 'node:crypto'
import { logger } from '../../logger'
import { toGraphQLError } from '../../utils/errors'

export const createVideoResolver = async (
	_: unknown,
	args: MutationCreateVideoArgs,
	contextValue: ServerContext,
): Promise<CreateVideoPayload> => {
	const {
		audioFilename,
		imageFilename,
		enableAudioNormalisation,
		normaliseAudioSettings,
	} = args.input
	const s3Client = contextValue.s3.client
	const pubSub = contextValue.pubSub
	const audioPath = tempFile(audioFilename)
	const imagePath = tempFile(imageFilename)
	const outputFilename = generateFilename('mp4')
	const outputPath = tempFile(outputFilename)
	const trackingId = randomUUID()

	downloadAssets({
		s3Client,
		audioFilename,
		audioPath,
		imageFilename,
		imagePath,
	})
		.chain(() => {
			const actions: EitherAsync<
				ResizeImageError | NormaliseAudioError,
				void
			>[] = [
				resizeImage({
					inputPath: imagePath,
					aspectRatio: SixteenByNine,
					outputPath,
				}),
			]

			if (enableAudioNormalisation) {
				actions.push(
					normaliseAudio({
						inputPath: audioPath,
						outputPath: audioPath,
						settings: normaliseAudioSettings ?? defaultSettings,
					}),
				)
			}

			return EitherAsync.all(actions)
		})
		.chain(() =>
			createVideo({
				audioPath,
				imagePath,
				outputPath,
				onProgress: percentageComplete =>
					pubSub.publish('creatingVideo', trackingId, {
						__typename: 'CreatingVideoPayload',
						percentageComplete,
					}),
			}),
		)
		.chain(() =>
			uploadToS3(s3Client, outputFilename, fs.createReadStream(outputPath)),
		)
		.ifLeft(e => {
			logger.error(e.toString())
			pubSub.publish('creatingVideo', trackingId, toGraphQLError(e))
		})
		.ifRight(() =>
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				percentageComplete: 100,
				outputFilename,
			}),
		)
		.run()

	return { __typename: 'CreateVideoPayload', trackingId }
}
