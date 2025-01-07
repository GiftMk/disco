import type {
	QueryUploadDetailsArgs,
	UploadDetailsPayload,
	UploadDetailsResponse,
} from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { concurrently } from '../utils/eitherAsync'
import { logger } from '../logger'
import { randomUUID } from 'node:crypto'
import { toGraphQLError } from '../utils/toGraphQLError'

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
		.ifLeft(failure => logger.error(failure.toString()))
		.mapLeft(toGraphQLError)
		.run()

	return response.extract()
}
