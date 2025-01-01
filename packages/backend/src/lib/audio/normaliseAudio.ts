import ffmpeg from 'fluent-ffmpeg'
import { asyncResult, Result } from '../result'
import { getMetadata } from './getMetadata'
import type { NormalisationSettings } from './NormalisationSettings'
import { getInputOptions } from './getInputOptions'
import { logger } from '../logger'

const defaultSettings: Readonly<NormalisationSettings> = {
	integrated: -16,
	truePeak: -1.5,
	loudnessRange: 11,
}

type NormaliseAudioRequest = {
	inputPath: string
	outputPath: string
	settings?: NormalisationSettings
}

export const normaliseAudio = async ({
	inputPath,
	outputPath,
	settings = defaultSettings,
}: NormaliseAudioRequest): Promise<Result> => {
	const metadataResult = await getMetadata(inputPath, settings)

	if (metadataResult.isFailure) {
		return Result.failure(metadataResult.error)
	}

	return asyncResult((resolve, reject) => {
		const metadata = metadataResult.value

		ffmpeg(inputPath)
			.audioFilters([
				{
					filter: 'loudnorm',
					options: [
						...getInputOptions(settings),
						'print_format=json',
						`measured_I=${metadata.inputIntegrated}`,
						`measured_LRA=${metadata.inputLoudnessRange}`,
						`measured_TP=${metadata.inputTruePeak}`,
						`measured_thresh=${metadata.inputThreshold}`,
						`offset=${metadata.targetOffset}`,
						'linear=true',
					],
				},
			])
			.audioBitrate(320)
			.on('start', command =>
				logger
					.namespace('normaliseAudio')
					.info(`Started normalising audio with command ${command}`),
			)
			.on('end', () => resolve())
			.on('error', e => reject(`Failed to normalise audio ${inputPath}`))
			.saveToFile(outputPath)
	})
}
