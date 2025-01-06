import type {
	QueryUploadDetailsArgs,
	UploadDetailsPayload,
	UploadDetailsResponse,
} from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { concurrently } from '../utils/eitherAsync'
import { logger } from '../logger'
import { randomUUID } from 'node:crypto'

export const uploadDetailsResolver = async (
	_: unknown,
	args: QueryUploadDetailsArgs,
	contextValue: ServerContext,
): Promise<UploadDetailsResponse> => {
	const { audioExtension, imageExtension } = args.input
	const { assetRepository } = contextValue

	const response = await concurrently(
		{ run: assetRepository.getUploadUrl(audioExtension) },
		{ run: assetRepository.getUploadUrl(imageExtension) },
	)
		.map<UploadDetailsPayload>(([audioUploadUrl, imageUploadUrl]) => ({
			__typename: 'UploadDetailsPayload',
			audioUploadUrl: audioUploadUrl as string,
			imageUploadUrl: imageUploadUrl as string,
			audioFilename: randomUUID(),
			imageFilename: randomUUID(),
		}))
		.mapLeft(e => ({
			__typename: e.type,
			message: e.message,
		}))
		.ifLeft(e => logger.error(e.toString()))
		.run()

	return response.extract()
}
