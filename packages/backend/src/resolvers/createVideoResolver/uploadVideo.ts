import type { S3Client } from '@aws-sdk/client-s3'
import { env } from '../../environment'
import { uploadToS3 } from '../../utils/uploadToS3'
import fs from 'node:fs'
import type { EitherAsync } from 'purify-ts'
import { RightAsync } from '../../utils/eitherAsync'
import type { GenericError } from '../../lib/GenericError'

type UploadVideoProps = {
	s3Client: S3Client
	videoFilename: string
	videoPath: string
}

export const uploadVideo = ({
	s3Client,
	videoFilename,
	videoPath,
}: UploadVideoProps): EitherAsync<GenericError, void> => {
	if (!env.USE_S3) {
		return RightAsync(undefined)
	}
	return uploadToS3(s3Client, videoFilename, fs.createReadStream(videoPath))
}
