import ffmpeg from 'fluent-ffmpeg'
import type { AspectRatio } from './dimensions/AspectRatio'
import { getCroppedDimensions } from './dimensions/getCroppedDimensions'
import { getDimensions } from './dimensions/getDimensions'
import { crop } from './filters/crop'
import { scale } from './filters/scale'
import {
	failure,
	isFailure,
	emptySuccess,
	getValueOrThrow,
	type Result,
} from '../result'
import { logger } from '../logger'

type ResizeImageRequest = {
	inputPath: string
	aspectRatio: AspectRatio
	outputPath: string
}

export const resizeImage = async ({
	inputPath,
	aspectRatio,
	outputPath,
}: ResizeImageRequest): Promise<Result> => {
	const dimensionsResult = await getDimensions(inputPath)
	if (isFailure(dimensionsResult)) return dimensionsResult

	const dimensions = getValueOrThrow(dimensionsResult)
	const croppedDimensionsResult = getCroppedDimensions(
		dimensions,
		aspectRatio.ratio,
	)

	if (isFailure(croppedDimensionsResult)) return croppedDimensionsResult
	const croppedDimensions = getValueOrThrow(croppedDimensionsResult)

	try {
		return await new Promise<Result>((resolve, reject) => {
			ffmpeg()
				.input(inputPath)
				.videoFilters([crop(croppedDimensions), scale({ ...aspectRatio })])
				.on('start', command =>
					logger.info(`Started resizing image with command ${command}`),
				)
				.on('end', () => {
					logger.info('Finished resizing image')
					resolve(emptySuccess())
				})
				.on('error', e => {
					reject(failure(e.message))
				})
				.saveToFile(outputPath)
		})
	} catch (e) {
		if (e instanceof Error) {
			return failure(e.message)
		}
		return failure(
			`An unknown error occurred while resizing image '${outputPath}'`,
		)
	}
}
