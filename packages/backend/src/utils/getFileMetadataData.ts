import ffmpeg from 'fluent-ffmpeg'
import { toEitherAsync } from './eitherAsync'
import type { EitherAsync } from 'purify-ts'
import { Failure } from '../lib/Failure'

export type FileMetadata = ffmpeg.FfprobeData

export const getFileMetadata = (
	filePath: string,
): EitherAsync<Failure, FileMetadata> => {
	return toEitherAsync((right, left) => {
		try {
			ffmpeg(filePath).ffprobe((error, data) => {
				if (error) {
					left(new Failure(`Failed to get metadata for file ${filePath}`))
				} else {
					right(data)
				}
			})
		} catch {
			left(
				new Failure(
					`Failed to get metadata for file ${filePath}, an unhandled error occurred`,
				),
			)
		}
	})
}
