import { getMetadata } from './getMetadata/getMetadata'
import type { NormalisationSettings } from './NormalisationSettings'
import type { LoudnormMetadata } from './getMetadata'
import { toEitherAsync } from '../toEitherAsync'
import ffmpeg from 'fluent-ffmpeg'
import { getInputOptions } from './getInputOptions'
import { logger } from '../logger'
import type { EitherAsync } from 'purify-ts'

type NormaliseAudioProps = {
	inputPath: string
	outputPath: string
	settings: NormalisationSettings
}

type ExecuteProps = NormaliseAudioProps & { metadata: LoudnormMetadata }

const execute = ({
	inputPath,
	outputPath,
	settings,
	metadata,
}: ExecuteProps): EitherAsync<string, void> => {
	return toEitherAsync((resolve, reject) =>
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
			.saveToFile(outputPath),
	)
}

export const normaliseAudio = (
	props: NormaliseAudioProps,
): EitherAsync<string, void> => {
	const { inputPath, settings } = props
	return getMetadata(inputPath, settings).chain(metadata =>
		execute({ ...props, metadata }),
	)
}
