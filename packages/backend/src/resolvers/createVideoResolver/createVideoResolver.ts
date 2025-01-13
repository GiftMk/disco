import {
	CreatingVideoStep,
	type CreateVideoResponse,
	type MutationCreateVideoArgs,
} from '../../generated/graphql'
import type { ServerContext } from '../../serverContext'
import { randomUUID } from 'node:crypto'
import { logger } from '../../logger'
import { toGraphQLError } from '../../utils/toGraphQLError'
import { downloadAssets } from './downloadAssets'
import { processAssets } from './processAssets'
import { produceVideo } from './produceVideo'
import { uploadVideo } from './uploadVideo'

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
	const trackingId = 'giftmk'

	await tempDirectory.lock()

	downloadAssets({
		pubSub,
		trackingId,
		tempDirectory,
		assetRepository,
		audioFilename,
		imageFilename,
	})
		.chain(({ audioFile, imageFile }) =>
			processAssets({
				pubSub,
				trackingId,
				tempDirectory,
				audioFile,
				imageFile,
				normalisation: {
					settings: normaliseAudioSettings,
					isEnabled: Boolean(enableAudioNormalisation),
				},
			}),
		)
		.chain(({ audioFile, imageFile }) =>
			produceVideo({ pubSub, trackingId, audioFile, imageFile, tempDirectory }),
		)
		.chain(({ videoFile }) =>
			uploadVideo({ pubSub, trackingId, assetRepository, videoFile }),
		)
		.ifLeft(failure => {
			logger.error(failure.toString())

			pubSub.publish('creatingVideo', trackingId, toGraphQLError(failure))
		})
		.ifRight(({ videoFilename }) => {
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				outputFilename: videoFilename,
				currentStep: CreatingVideoStep.Finished,
			})
		})
		.run()
		.finally(() => tempDirectory.unlock())

	return { __typename: 'CreateVideoPayload', trackingId }
}
