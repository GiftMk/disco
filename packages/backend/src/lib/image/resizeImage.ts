import ffmpeg from 'fluent-ffmpeg'
import type { AspectRatio } from './dimensions/AspectRatio'
import { getCroppedDimensions } from './dimensions/getCroppedDimensions'
import { getDimensions } from './dimensions/getDimensions'
import { crop } from './filters/crop'
import { scale } from './filters/scale'
import { asyncResult, Result } from '../result'
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

	if (dimensionsResult.isFailure) {
		return Result.failure(dimensionsResult.error)
	}

	const dimensions = dimensionsResult.value
	const croppedDimensionsResult = getCroppedDimensions(
		dimensions,
		aspectRatio.ratio,
	)

	if (croppedDimensionsResult.isFailure) {
		return Result.failure(croppedDimensionsResult.error)
	}

	return asyncResult((resolve, reject) => {
		const croppedDimensions = croppedDimensionsResult.value

		ffmpeg()
			.input(inputPath)
			.videoFilters([crop(croppedDimensions), scale({ ...aspectRatio })])
			.on('start', command =>
				logger.info(`Started resizing image with command ${command}`),
			)
			.on('end', () => {
				logger.info('Finished resizing image')
				resolve()
			})
			.on('error', e => {
				reject(`Failed to resize image '${outputPath}'`)
			})
			.saveToFile(outputPath)
	})
}
