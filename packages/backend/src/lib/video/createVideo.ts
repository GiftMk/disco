import ffmpeg from 'fluent-ffmpeg'
import { emptySuccess, failure, type Result } from '../result'
import { logger } from '../logger'
import { getAudioDurationInSeconds } from './getAudioDuration'
import { getPercentageComplete } from './getPercentageComplete'

type VideoRequest = {
	audioPath: string
	imagePath: string
	outputPath: string
	onProgress?: (percentageComplete: number | undefined) => void
}

export const createVideo = async ({
	audioPath,
	imagePath,
	outputPath,
	onProgress,
}: VideoRequest): Promise<Result> => {
	const audioDurationResult = await getAudioDurationInSeconds(audioPath)

	try {
		await new Promise<void>((resolve, reject) => {
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
					const percentageComplete = getPercentageComplete(
						timemark,
						audioDurationResult,
					)
					if (percentageComplete) {
						logger.info(`Percentage complete: ${percentageComplete}`)
						onProgress?.(percentageComplete)
					}
				})
				.on('error', ({ message }) => {
					logger.error(message)
					reject()
				})
				.saveToFile(outputPath)
		})

		return emptySuccess()
	} catch (e) {
		if (e instanceof Error) {
			return failure(e.message)
		}

		return failure('An unknown error occurred')
	}
}
