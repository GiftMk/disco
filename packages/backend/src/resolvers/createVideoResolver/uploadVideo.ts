import type { S3Client } from '@aws-sdk/client-s3'
import { env } from '../../environment'
import { uploadToS3 } from '../s3-utils/uploadToS3'
import fs from 'node:fs'

type UploadVideoProps = {
	s3Client: S3Client
	videoFilename: string
	videoPath: string
}

export const uploadVideo = async ({
	s3Client,
	videoFilename,
	videoPath,
}: UploadVideoProps) => {
	if (!env.USE_S3) {
		return
	}
	await uploadToS3(s3Client, videoFilename, fs.createReadStream(videoPath))
}
