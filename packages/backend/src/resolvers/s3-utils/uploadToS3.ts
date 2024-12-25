import { Upload } from '@aws-sdk/lib-storage'
import type { S3Client } from '@aws-sdk/client-s3'
import type { Readable } from 'node:stream'
import { type Result, emptySuccess, failure } from '../../lib/result'
import { logger } from '../../lib/logger'
import { env } from '../../environment'

export const uploadToS3 = async (
	s3Client: S3Client,
	key: string,
	body: Readable,
): Promise<Result> => {
	const bucket = env.OUTPUT_BUCKET

	try {
		const uploadToS3 = new Upload({
			client: s3Client,
			params: {
				Bucket: bucket,
				Key: key,
				Body: body,
			},
		})

		uploadToS3.on('httpUploadProgress', ({ loaded, total }) =>
			logger.info(
				`Uploading ${key} to S3 bucket ${bucket}, uploaded ${loaded}/${total} bytes`,
			),
		)

		await uploadToS3.done()
		return emptySuccess()
	} catch (e) {
		return failure(`Uploading ${key} to S3 bucket ${bucket}`, e)
	}
}
