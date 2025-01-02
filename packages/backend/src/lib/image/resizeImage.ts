import ffmpeg from 'fluent-ffmpeg'
import type { AspectRatio } from './dimensions/AspectRatio'
import { cropDimensions } from './dimensions/cropDimensions'
import { getDimensions } from './dimensions/getDimensions'
import { crop } from './filters/crop'
import { scale } from './filters/scale'
import { logger } from '../logger'
import { getFileMetadata } from '../getFileMetadataData'
import type { Dimensions } from './dimensions/Dimensions'
import { toEitherAsync } from '../toEitherAsync'
import type { EitherAsync } from 'purify-ts/EitherAsync'

type ResizeImageProps = Readonly<{
	inputPath: string
	aspectRatio: AspectRatio
	outputPath: string
}>

type ExecuteProps = ResizeImageProps & { dimensions: Dimensions }

const execute = ({
	inputPath,
	outputPath,
	aspectRatio,
	dimensions,
}: ExecuteProps): EitherAsync<string, void> => {
	return toEitherAsync((resolve, reject) =>
		ffmpeg()
			.input(inputPath)
			.videoFilters([crop(dimensions), scale({ ...aspectRatio })])
			.on('start', command =>
				logger.info(`Started resizing image with command ${command}`),
			)
			.on('end', () => {
				logger.info('Finished resizing image')
				resolve()
			})
			.on('error', e => {
				logger.error(e.message)
				reject(`Failed to resize image '${outputPath}' the following error`)
			})
			.saveToFile(outputPath),
	)
}

export const resizeImage = (
	props: ResizeImageProps,
): EitherAsync<string, void> => {
	const { inputPath, aspectRatio } = props
	return getFileMetadata(inputPath)
		.chain(async metadata => getDimensions(metadata))
		.chain(async dimensions => cropDimensions(dimensions, aspectRatio.ratio))
		.chain(dimensions => execute({ ...props, dimensions }))
}
