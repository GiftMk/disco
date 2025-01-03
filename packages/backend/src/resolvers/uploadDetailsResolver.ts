import type {
	QueryUploadDetailsArgs,
	UploadDetailsPayload,
	UploadDetailsResponse,
} from '../generated/graphql'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import type { ServerContext } from '../serverContext'
import { generateFilename } from '../utils/generateFilename'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { toEitherAsync } from '../utils/eitherAsync'
import { GenericError } from '../lib/GenericError'
import { logger } from '../logger'

const URL_TIMEOUT_S = 60 * 15

const getUploadUrl = (
	s3Client: S3Client,
	bucket: string,
	key: string,
): EitherAsync<GenericError, string> => {
	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: key,
	})

	return toEitherAsync(async (resolve, reject) => {
		try {
			const url = await getSignedUrl(s3Client, command, {
				expiresIn: URL_TIMEOUT_S,
			})
			resolve(url)
		} catch {
			reject(
				new GenericError(
					`Failed to get signed url for key ${key} in bucket ${bucket}`,
				),
			)
		}
	})
}

export const uploadDetailsResolver = async (
	_: unknown,
	args: QueryUploadDetailsArgs,
	contextValue: ServerContext,
): Promise<UploadDetailsResponse> => {
	const { audioExtension, imageExtension } = args.input
	const audioFilename = generateFilename(audioExtension)
	const imageFilename = generateFilename(imageExtension)

	const response = await EitherAsync.all([
		getUploadUrl(
			contextValue.s3.client,
			contextValue.s3.uploadBucket,
			audioFilename,
		),
		getUploadUrl(
			contextValue.s3.client,
			contextValue.s3.uploadBucket,
			imageFilename,
		),
	])
		.map<UploadDetailsPayload>(([audioUploadUrl, imageUploadUrl]) => ({
			__typename: 'UploadDetailsPayload',
			audioUploadUrl: audioUploadUrl as string,
			imageUploadUrl: imageUploadUrl as string,
			audioFilename,
			imageFilename,
		}))
		.mapLeft(e => ({
			__typename: e.type,
			message: e.message,
		}))
		.ifLeft(e => logger.error(e.toString()))
		.run()

	return response.extract()
}
