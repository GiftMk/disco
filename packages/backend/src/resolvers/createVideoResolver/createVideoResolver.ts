import {
	CreatingVideoStep,
	type CreateVideoResponse,
	type MutationCreateVideoArgs,
} from '../../generated/graphql'
import { createVideo } from '../../lib/video/createVideo'
import type { ServerContext } from '../../serverContext'
import { randomUUID } from 'node:crypto'
import { logger } from '../../logger'
import { concurrently, toEitherAsync } from '../../utils/eitherAsync'
import { getExtension } from '../../utils/getExtension'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import { defaultSettings } from '../../lib/audio/defaultSettings'
import { toGraphQLError } from '../../utils/toGraphQLError'

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

	await tempDirectory.lock()

	toEitherAsync(async right => {
		setTimeout(() => right(undefined), 10000)
	}).ifRight(() =>
		pubSub.publish('creatingVideo', trackingId, {
			__typename: 'CreatingVideoPayload',
			currentStep: CreatingVideoStep.DownloadingAssets,
		}),
	)
	concurrently(
		{ run: assetRepository.download(audioFilename, audioFile) },
		{ run: assetRepository.download(imageFilename, imageFile) },
	)
		.ifRight(() =>
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				currentStep: CreatingVideoStep.ProcessingAssets,
				percentageComplete: 0,
			}),
		)
		.chain(() => {
			const progress = { resizeImage: 0, normaliseAudio: 0 }
			const handleProgress = (
				action: 'resizeImage' | 'normaliseAudio',
				percentageComplete: number,
			) => {
				progress[action] = percentageComplete
				pubSub.publish('creatingVideo', trackingId, {
					__typename: 'CreatingVideoPayload',
					currentStep: CreatingVideoStep.ProcessingAssets,
					percentageComplete: Math.min(
						progress.resizeImage,
						progress.normaliseAudio,
					),
				})
			}

			return concurrently(
				{
					run: resizeImage({
						inputPath: imageFile.path,
						outputPath: resizedImageFile.path,
						aspectRatio: SixteenByNine,
						onProgress: percentageComplete =>
							handleProgress('resizeImage', percentageComplete),
					}),
				},
				{
					run: normaliseAudio({
						inputPath: audioFile.path,
						outputPath: normalisedAudioFile.path,
						settings: normaliseAudioSettings ?? defaultSettings,
						onProgress: percentageComplete =>
							handleProgress('normaliseAudio', percentageComplete),
					}),
					predicate: () => normalisationIsEnabled,
				},
			)
		})
		.ifRight(() =>
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				currentStep: CreatingVideoStep.CreatingVideo,
				percentageComplete: 0,
			}),
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
						currentStep: CreatingVideoStep.CreatingVideo,
						percentageComplete,
					}),
			})
		})
		.ifRight(() =>
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				currentStep: CreatingVideoStep.UploadingVideo,
				percentageComplete: 0,
			}),
		)
		.chain(() =>
			assetRepository.upload(outputFile, percentageComplete =>
				pubSub.publish('creatingVideo', trackingId, {
					__typename: 'CreatingVideoPayload',
					currentStep: CreatingVideoStep.UploadingVideo,
					percentageComplete,
				}),
			),
		)
		.ifLeft(failure => {
			logger.error(failure.toString())

			pubSub.publish('creatingVideo', trackingId, toGraphQLError(failure))
		})
		.run()
		.finally(() => tempDirectory.unlock())

	return { __typename: 'CreateVideoPayload', trackingId }
}
