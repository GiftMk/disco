import type {
	CreateVideoError,
	CreateVideoPayload,
	CreateVideoResponse,
	MutationCreateVideoArgs,
} from '../../generated/graphql'
import { tempFile } from '../../lib/utils/tempFile'
import { createVideo } from '../../lib/video/createVideo'
import { pubsub } from '../../pubsub'
import type { ServerContext } from '../../serverContext'
import { uploadToS3 } from '../s3-utils/uploadToS3'
import fs from 'node:fs'
import { downloadAssets } from './downloadAssets'
import { generateFilename } from '../../lib/utils/generateFilename'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import { defaultSettings } from '../../lib/audio/defaultSettings'
import { EitherAsync } from 'purify-ts'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'

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

	const result = await downloadAssets({
		s3Client,
		audioFilename,
		audioPath,
		imageFilename,
		imagePath,
	})
		.chain(() => {
			const actions = [
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
					pubsub.publish('CREATING_VIDEO', {
						creatingVideo: { percentageComplete },
					}),
			}),
		)
		.chain(() =>
			uploadToS3(s3Client, outputFilename, fs.createReadStream(outputPath)),
		)
		.ifRight(() =>
			pubsub.publish('CREATING_VIDEO', {
				creatingVideo: { percentageComplete: 100 },
			}),
		)
		.map<CreateVideoPayload>(() => ({
			__typename: 'CreateVideoPayload',
			outputFilename,
		}))
		.mapLeft<CreateVideoError>(message => ({
			__typename: 'CreateVideoError',
			message,
		}))
		.run()

	return result.extract()
}
