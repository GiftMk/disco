import ffmpeg from 'fluent-ffmpeg'
import { emptySuccess, failure, type Result } from '../result'
import { logger } from '../logger'

type VideoRequest = {
	audioPath: string
	imagePath: string
	outputPath: string
	onProgress?: (timestamp: string) => void
}

export const createVideo = async ({
	audioPath,
	imagePath,
	outputPath,
	onProgress,
}: VideoRequest): Promise<Result> => {
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
					logger.info(`Current timestamp: ${timemark}`)
					if (typeof timemark === 'string') {
						onProgress?.(timemark)
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
