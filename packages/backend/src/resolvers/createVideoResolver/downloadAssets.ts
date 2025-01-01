import type { S3Client } from '@aws-sdk/client-s3'
import { downloadFromS3 } from '../s3-utils/downloadFromS3'
import { Result } from '../../lib/result'

type DownloadAssetsProps = {
	s3Client: S3Client
	audioFilename: string
	audioPath: string
	imageFilename: string
	imagePath: string
}

export const downloadAssets = async ({
	s3Client,
	audioFilename,
	audioPath,
	imageFilename,
	imagePath,
}: DownloadAssetsProps): Promise<Result> => {
	const results = await Promise.all([
		downloadFromS3(s3Client, audioFilename, audioPath),
		downloadFromS3(s3Client, imageFilename, imagePath),
	])

	const failedResults = results.filter(r => r.isFailure)

	if (failedResults.length) {
		const message = failedResults.map(r => r.error).join(', ')
		return Result.failure(message)
	}

	return Result.success()
}
