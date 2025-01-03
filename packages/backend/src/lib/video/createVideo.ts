import { getAudioDuration } from './getAudioDuration'
import { getFileMetadata } from '../../utils/getFileMetadataData'
import { logger } from '../../logger'
import { getPercentageComplete } from './getPercentageComplete'
import { toEitherAsync } from '../../utils/eitherAsync'
import ffmpeg from 'fluent-ffmpeg'
import type { EitherAsync } from 'purify-ts/EitherAsync'
import { CreateVideoError } from './CreateVideoError'

type CreateVideoProps = {
	audioPath: string
	imagePath: string
	outputPath: string
	onProgress: (percentageComplete: number) => void
}

type ExecuteProps = CreateVideoProps & { audioDuration: number }

const execute = ({
	audioPath,
	imagePath,
	outputPath,
	audioDuration,
	onProgress,
}: ExecuteProps): EitherAsync<CreateVideoError, void> => {
	return toEitherAsync((resolve, reject) => {
		try {
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
				.on('start', c =>
					logger.info(`Started making video using command: ${c}`),
				)
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
						new CreateVideoError(
							`Failed to create video from audio ${audioPath} and image ${imagePath}`,
						),
					),
				)
				.saveToFile(outputPath)
		} catch {
			reject(
				new CreateVideoError(
					`Failed to create video from audio ${audioPath} and image ${imagePath}`,
				),
			)
		}
	})
}

export const createVideo = (
	props: CreateVideoProps,
): EitherAsync<CreateVideoError, void> => {
	return getFileMetadata(props.audioPath)
		.mapLeft(e => new CreateVideoError(e.message))
		.chain(async metadata => getAudioDuration(metadata))
		.chain(audioDuration => execute({ ...props, audioDuration }))
}
