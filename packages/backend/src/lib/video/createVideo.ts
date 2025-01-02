import { getAudioDuration } from './getAudioDuration'
import { getFileMetadata } from '../../utils/getFileMetadataData'
import { logger } from '../../logger'
import { getPercentageComplete } from './getPercentageComplete'
import { toEitherAsync } from '../../utils/eitherAsync'
import ffmpeg from 'fluent-ffmpeg'
import type { EitherAsync } from 'purify-ts/EitherAsync'

type CreateVideoProps = {
	audioPath: string
	imagePath: string
	outputPath: string
	onProgress: (percentageComplete: number | undefined) => void
}

type ExecuteProps = CreateVideoProps & { audioDuration: number }

const execute = ({
	audioPath,
	imagePath,
	outputPath,
	audioDuration,
	onProgress,
}: ExecuteProps): EitherAsync<string, void> => {
	return toEitherAsync((resolve, reject) => {
		ffmpeg()
			.input(imagePath)
			.inputFPS(1)
			.loop()
			.input(audioPath)
			.audioCodec('aac')
			.audioBitrate(320)
			.videoCodec('libx264')
			.outputOption('-pix_fmt', 'yuv420p')
			.outputOption('-shortest')
			.on('start', c => logger.info(`Started making video using command: ${c}`))
			.on('end', () => {
				logger.info(`Finished making video ${outputPath}`)
				resolve()
			})
			.on('progress', ({ timemark }) => {
				getPercentageComplete(timemark, audioDuration).ifJust(
					percentageComplete => {
						logger.info(`Percentage complete: ${percentageComplete}`)
						onProgress(percentageComplete)
					},
				)
			})
			.on('error', () =>
				reject(
					`Failed to create video from audio ${audioPath} and image ${imagePath}`,
				),
			)
			.saveToFile(outputPath)
	})
}

export const createVideo = (
	props: CreateVideoProps,
): EitherAsync<string, void> => {
	return getFileMetadata(props.audioPath)
		.chain(async metadata => getAudioDuration(metadata))
		.chain(audioDuration => execute({ ...props, audioDuration }))
}
