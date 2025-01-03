import ffmpeg from 'fluent-ffmpeg'
import { toEitherAsync } from './eitherAsync'
import type { EitherAsync } from 'purify-ts'
import { GenericError } from '../lib/GenericError'

export type FileMetadata = ffmpeg.FfprobeData

export const getFileMetadata = (
	filePath: string,
): EitherAsync<GenericError, FileMetadata> => {
	return toEitherAsync((right, left) => {
		try {
			ffmpeg(filePath).ffprobe((error, data) => {
				if (error) {
					left(new GenericError(`Failed to get metadata for file ${filePath}`))
				} else {
					right(data)
				}
			})
		} catch {
			left(
				new GenericError(
					`Failed to get metadata for file ${filePath}, an unhandled error occurred`,
				),
			)
		}
	})
}
