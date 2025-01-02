import type { S3Client } from '@aws-sdk/client-s3'
import { downloadFromS3 } from '../s3-utils/downloadFromS3'
import { EitherAsync, Right } from 'purify-ts'
import { env } from '../../environment'

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
}: DownloadAssetsProps): EitherAsync<string, void> => {
	if (env.USE_S3) {
		return EitherAsync.all([
			downloadFromS3(s3Client, audioFilename, audioPath),
			downloadFromS3(s3Client, imageFilename, imagePath),
		]).void()
	}

	return EitherAsync.liftEither(Right(undefined))
}
