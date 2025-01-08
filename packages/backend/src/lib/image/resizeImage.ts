import ffmpeg from 'fluent-ffmpeg'
import type { AspectRatio } from './dimensions/AspectRatio'
import { cropDimensions } from './dimensions/cropDimensions'
import { getDimensions } from './dimensions/getDimensions'
import { crop } from './filters/crop'
import { scale } from './filters/scale'
import { logger } from '../../logger'
import { getFileMetadata } from '../../utils/getFileMetadataData'
import type { Dimensions } from './dimensions/Dimensions'
import { toEitherAsync } from '../../utils/eitherAsync'
import type { EitherAsync } from 'purify-ts/EitherAsync'
import { Failure } from '../Failure'

type ResizeImageProps = Readonly<{
	inputPath: string
	aspectRatio: AspectRatio
	outputPath: string
	onProgress?: (percentageComplete: number) => void
}>

type ExecuteProps = ResizeImageProps & { dimensions: Dimensions }

const execute = ({
	inputPath,
	outputPath,
	aspectRatio,
	dimensions,
	onProgress,
}: ExecuteProps): EitherAsync<Failure, void> => {
	return toEitherAsync((resolve, reject) =>
		ffmpeg()
			.input(inputPath)
			.videoFilters([crop(dimensions), scale({ ...aspectRatio })])
			.on('start', command =>
				logger.info(`Started resizing image with command ${command}`),
			)
			.on('progress', progress =>
				logger.info('Image resize progress', JSON.stringify(progress)),
			)
			.on('end', () => {
				logger.info('Finished resizing image')
				resolve()
			})
			.on('error', e => {
				logger.error(e.message)
				reject(
					new Failure(
						`Failed to resize image '${outputPath}' the following error`,
					),
				)
			})
			.saveToFile(outputPath),
	)
}

export const resizeImage = (
	props: ResizeImageProps,
): EitherAsync<Failure, void> => {
	const { inputPath, aspectRatio } = props
	return getFileMetadata(inputPath)
		.chain(async metadata => getDimensions(metadata))
		.chain(async dimensions => cropDimensions(dimensions, aspectRatio.ratio))
		.chain(dimensions => execute({ ...props, dimensions }))
}
