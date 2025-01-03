import { Upload } from '@aws-sdk/lib-storage'
import type { S3Client } from '@aws-sdk/client-s3'
import type { Readable } from 'node:stream'
import { logger } from '../logger'
import { env } from '../environment'
import { GenericError } from '../lib/GenericError'
import { toEitherAsync } from './eitherAsync'
import type { EitherAsync } from 'purify-ts/EitherAsync'

const BUCKET = env.OUTPUT_BUCKET

export const uploadToS3 = (
	s3Client: S3Client,
	key: string,
	body: Readable,
): EitherAsync<GenericError, void> => {
	return toEitherAsync(async (resolve, reject) => {
		try {
			const uploadToS3 = new Upload({
				client: s3Client,
				params: {
					Bucket: BUCKET,
					Key: key,
					Body: body,
				},
			})

			uploadToS3.on('httpUploadProgress', ({ loaded, total }) =>
				logger.info(
					`Uploading ${key} to S3 bucket ${BUCKET}, uploaded ${loaded}/${total} bytes`,
				),
			)

			await uploadToS3.done()

			logger.info(`Finished uploading ${key} to S3 bucket ${BUCKET}`)
			resolve()
		} catch {
			reject(
				new GenericError(`Failed to upload key ${key} to S3 bucket ${BUCKET}`),
			)
		}
	})
}
