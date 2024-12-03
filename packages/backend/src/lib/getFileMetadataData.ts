import ffmpeg from 'fluent-ffmpeg'
import { failure, success, type Result } from './result'

export const getFileMetadata = async (
	filePath: string,
): Promise<Result<ffmpeg.FfprobeData>> => {
	try {
		const data = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
			ffmpeg(filePath).ffprobe((error, data) => {
				if (error) {
					reject(error)
				} else {
					return resolve(data)
				}
			})
		})

		return success(data)
	} catch (e) {
		if (e instanceof Error) {
			return failure(e.message)
		}
		return failure(
			`An unknown error occurred when reading metadata for file ${filePath}`,
		)
	}
}
