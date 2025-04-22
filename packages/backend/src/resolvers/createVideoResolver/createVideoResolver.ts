import type {
	CreateVideoResponse,
	MutationCreateVideoArgs,
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
	const { audio, image } = args

	const { pubSub, assetRepository, tempDirectoryRepository } = context
	using tempDirectory = tempDirectoryRepository.newDirectory()
	const trackingId = randomUUID()

	await tempDirectory.lock()

	downloadAssets({
		pubSub,
		trackingId,
		tempDirectory,
		assetRepository,
		audioFilename: audio.assetId,
		imageFilename: image.assetId,
	})
		.chain(({ audioFile, imageFile }) =>
			processAssets({
				pubSub,
				trackingId,
				tempDirectory,
				audioFile,
				imageFile,
				normalisation: {
					settings: audio.settings,
					isEnabled: Boolean(audio.settings),
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
				videoFilename,
			})
		})
		.run()
		.finally(() => tempDirectory.unlock())

	return { __typename: 'CreateVideoPayload', trackingId }
}
