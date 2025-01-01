import ffmpeg from 'fluent-ffmpeg'
import { asyncResult, type Result } from './result'
import { logger } from './logger'

export const getFileMetadata = (
	filePath: string,
): Promise<Result<ffmpeg.FfprobeData>> => {
	return asyncResult((resolve, reject) => {
		ffmpeg(filePath).ffprobe((error, data) => {
			if (error) {
				logger.error(error)
				return reject(`Failed to get metadata for file ${filePath}`)
			}
			return resolve(data)
		})
	})
}
