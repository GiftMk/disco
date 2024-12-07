import type { S3Client } from '@aws-sdk/client-s3'
import { GraphQLError } from 'graphql'
import { isFailure } from '../../lib/result'
import { downloadFromS3 } from '../s3-utils/downloadFromS3'

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
}: DownloadAssetsProps) => {
	const downloadAudioResult = await downloadFromS3(
		s3Client,
		audioFilename,
		audioPath,
	)

	if (isFailure(downloadAudioResult)) {
		throw new GraphQLError(
			`Failed to download audio file ${audioFilename} from S3. The following error(s) occurred: ${downloadAudioResult.error}`,
		)
	}

	const downloadImageResult = await downloadFromS3(
		s3Client,
		imageFilename,
		imagePath,
	)

	if (isFailure(downloadImageResult)) {
		throw new GraphQLError(
			`Failed to download audio file ${imageFilename} from S3. The following error(s) occurred: ${downloadImageResult.error}`,
		)
	}
}
