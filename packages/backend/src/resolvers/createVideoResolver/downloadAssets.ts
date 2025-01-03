import type { S3Client } from '@aws-sdk/client-s3'
import { downloadFromS3 } from '../../utils/downloadFromS3'
import { EitherAsync } from 'purify-ts'
import { env } from '../../environment'
import { RightAsync } from '../../utils/eitherAsync'
import type { GenericError } from '../../lib/GenericError'

type DownloadAssetsProps = {
	s3Client: S3Client
	audioFilename: string
	audioPath: string
	imageFilename: string
	imagePath: string
}

export const downloadAssets = ({
	s3Client,
	audioFilename,
	audioPath,
	imageFilename,
	imagePath,
}: DownloadAssetsProps): EitherAsync<GenericError, void> => {
	if (env.USE_S3) {
		return EitherAsync.all([
			downloadFromS3(s3Client, audioFilename, audioPath),
			downloadFromS3(s3Client, imageFilename, imagePath),
		]).void()
	}

	return RightAsync(undefined)
}
