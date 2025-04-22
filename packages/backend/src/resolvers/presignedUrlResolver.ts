import type { ServerContext } from '../serverContext'
import { logger } from '../logger'
import { randomUUID } from 'node:crypto'
import { toGraphQLError } from '../utils/toGraphQLError'
import type {
	PresignedUrlPayload,
	PresignedUrlResponse,
	QueryPresignedUrlArgs,
} from '../generated/graphql'

export const presignedUrlResolver = async (
	_: unknown,
	args: QueryPresignedUrlArgs,
	contextValue: ServerContext,
): Promise<PresignedUrlResponse> => {
	const { fileExtension } = args
	const { assetRepository } = contextValue

	const response = await assetRepository
		.getUploadUrl(fileExtension)
		.map<PresignedUrlPayload>(([url]) => ({
			__typename: 'PresignedUrlPayload',
			url: url as string,
			assetId: randomUUID(),
		}))
		.ifLeft(failure => logger.error(failure.toString()))
		.mapLeft(toGraphQLError)
		.run()

	return response.extract()
}
