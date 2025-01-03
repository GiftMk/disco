import {
	GetObjectCommand,
	type GetObjectCommandOutput,
	type S3Client,
} from '@aws-sdk/client-s3'
import { env } from '../environment'
import { writeBodyToFile } from './writeBodyToFile'
import type { EitherAsync } from 'purify-ts/EitherAsync'
import { toEitherAsync } from './eitherAsync'
import { GenericError } from '../lib/GenericError'

const BUCKET = env.INPUT_BUCKET

export const downloadFromS3 = (
	s3Client: S3Client,
	key: string,
	outputPath: string,
): EitherAsync<GenericError, void> => {
	return toEitherAsync<GenericError, GetObjectCommandOutput>(
		async (resolve, reject) => {
			try {
				const response = await s3Client.send(
					new GetObjectCommand({ Bucket: BUCKET, Key: key }),
				)

				if (response) {
					resolve(response)
				} else {
					reject(
						new GenericError(
							`No response was returned when downloading '${key}' from S3 bucket '${BUCKET}'`,
						),
					)
				}
			} catch {
				reject(
					new GenericError(
						`Failed to download key '${key}' from S3 bucket '${BUCKET}'`,
					),
				)
			}
		},
	).chain(response => writeBodyToFile(response.Body, outputPath))
}
