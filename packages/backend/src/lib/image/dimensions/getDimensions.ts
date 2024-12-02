import { failure, type Result, success } from '../../result'
import ffmpeg from 'fluent-ffmpeg'
import type { Dimensions } from './Dimensions'

export const getDimensions = async (
	imagePath: string,
): Promise<Result<Dimensions>> => {
	try {
		const data = await new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
			ffmpeg(imagePath).ffprobe((error, data) => {
				if (error) {
					reject(error)
				} else {
					return resolve(data)
				}
			})
		})

		const dataStream = data.streams[0]
		const width = dataStream?.width
		const height = dataStream?.height

		if (!width || !height) {
			return failure(`Failed to get dimensions for image '${imagePath}'`)
		}

		return success({ width, height })
	} catch (e) {
		if (e instanceof Error) {
			return failure(e.message)
		}
		return failure(
			`An unknown error occurred when getting dimensions for image '${imagePath}'`,
		)
	}
}
