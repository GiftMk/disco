import type {
	GenericError,
	CreateVideoResponse,
	MutationCreateVideoArgs,
} from '../../generated/graphql'
import { createVideo } from '../../lib/video/createVideo'
import type { ServerContext } from '../../serverContext'
import { randomUUID } from 'node:crypto'
import { logger } from '../../logger'
import { concurrently } from '../../utils/eitherAsync'
import { getExtension } from '../../utils/getExtension'
import type { ResizeImageError } from '../../lib/image/ResizeImageError'
import type { NormaliseAudioError } from '../../lib/audio/NormaliseAudioError'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import { defaultSettings } from '../../lib/audio/defaultSettings'

export const createVideoResolver = async (
	_: unknown,
	args: MutationCreateVideoArgs,
	context: ServerContext,
): Promise<CreateVideoResponse> => {
	const {
		audioFilename,
		imageFilename,
		enableAudioNormalisation,
		normaliseAudioSettings,
	} = args.input
	const { pubSub, assetRepository, tempDirectoryRepository } = context
	using tempDirectory = tempDirectoryRepository.newDirectory()

	const audioExtension = getExtension(audioFilename)
	const audioFile = tempDirectory.newFile(audioExtension)
	const normalisationIsEnabled = Boolean(enableAudioNormalisation)
	const normalisedAudioFile = tempDirectory.newFile(audioExtension)

	const imageExtension = getExtension(imageFilename)
	const imageFile = tempDirectory.newFile(imageExtension)
	const resizedImageFile = tempDirectory.newFile(imageExtension)

	const outputFile = tempDirectory.newFile('mp4')
	const trackingId = randomUUID()

	const downloadAssetsEither = await concurrently(
		{ run: assetRepository.download(audioFilename, audioFile) },
		{ run: assetRepository.download(imageFilename, imageFile) },
	).run()

	if (downloadAssetsEither.isLeft()) {
		return downloadAssetsEither
			.mapLeft<GenericError>(e => ({
				__typename: 'GenericError',
				message: e.message,
			}))
			.extract()
	}

	await tempDirectory.lock()
	concurrently<ResizeImageError | NormaliseAudioError, void>(
		{
			run: resizeImage({
				inputPath: imageFile.path,
				outputPath: resizedImageFile.path,
				aspectRatio: SixteenByNine,
			}),
		},
		{
			run: normaliseAudio({
				inputPath: audioFile.path,
				outputPath: normalisedAudioFile.path,
				settings: normaliseAudioSettings ?? defaultSettings,
			}),
			predicate: () => normalisationIsEnabled,
		},
	)
		.chain(() => {
			const audioPath = normalisationIsEnabled
				? normalisedAudioFile.path
				: audioFile.path

			return createVideo({
				audioPath,
				imagePath: resizedImageFile.path,
				outputPath: outputFile.path,
				onProgress: percentageComplete =>
					pubSub.publish('creatingVideo', trackingId, {
						__typename: 'CreatingVideoPayload',
						percentageComplete,
					}),
			})
		})
		.chain(() => assetRepository.upload(outputFile))
		.ifLeft(e => {
			logger.error(e.toString())

			pubSub.publish('creatingVideo', trackingId, {
				__typename: e.type,
				message: e.message,
			})
		})
		.ifRight(() =>
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				percentageComplete: 100,
				outputFilename: outputFile.name,
			}),
		)
		.run()
		.finally(() => tempDirectory.unlock())

	return { __typename: 'CreateVideoPayload', trackingId }
}
