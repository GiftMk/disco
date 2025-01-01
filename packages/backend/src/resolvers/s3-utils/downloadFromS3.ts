import { GetObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import { Result } from '../../lib/result'
import { env } from '../../environment'
import { writeBodyToFile } from './writeBodyToFile'

export const downloadFromS3 = async (
	s3Client: S3Client,
	key: string,
	outputPath: string,
): Promise<Result> => {
	const bucket = env.INPUT_BUCKET
	try {
		const response = await s3Client.send(
			new GetObjectCommand({ Bucket: bucket, Key: key }),
		)
		return await writeBodyToFile(response.Body, outputPath)
	} catch (e) {
		return Result.failure(
			`Failed to download key '${key}' from S3 bucket '${bucket}'`,
		)
	}
}
