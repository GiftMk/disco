import ffmpeg from 'fluent-ffmpeg'
import { asyncResult, type Result } from '../result'
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
	const duration = await getAudioDurationInSeconds(audioPath)

	return asyncResult((resolve, reject) => {
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
				if (duration.hasNoValue) return

				const percentageComplete = getPercentageComplete(
					timemark,
					duration.value,
				)

				if (percentageComplete.hasValue) {
					logger.info(`Percentage complete: ${percentageComplete.value}`)
					onProgress?.(percentageComplete.value)
				}
			})
			.on('error', e => {
				reject(
					`Failed to create video from audio ${audioPath} and image ${imagePath}`,
				)
			})
			.saveToFile(outputPath)
	})
}
