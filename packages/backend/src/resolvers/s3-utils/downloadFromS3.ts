import { GetObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import { emptySuccess, failure, isFailure, type Result } from '../../lib/result'
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
		const writeBodyResult = await writeBodyToFile(response.Body, outputPath)
		if (isFailure(writeBodyResult)) {
			return writeBodyResult
		}

		return emptySuccess()
	} catch (e) {
		if (e instanceof Error) {
			return failure(e.message)
		}
		return failure(
			`An unknown error occurred when downloading key ${key} from S3 bucket ${bucket}`,
		)
	}
}
