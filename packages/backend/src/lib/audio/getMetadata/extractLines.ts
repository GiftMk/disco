import { logger } from '../../../logger'
import { toEitherAsync } from '../../../utils/eitherAsync'
import { getInputOptions } from '../getInputOptions'
import type { NormalisationSettings } from '../NormalisationSettings'
import ffmpeg from 'fluent-ffmpeg'
import type { EitherAsync } from 'purify-ts/EitherAsync'
import { NormaliseAudioError } from '../NormaliseAudioError'

export const extractLines = (
	inputPath: string,
	settings: NormalisationSettings,
): EitherAsync<NormaliseAudioError, string[]> => {
	return toEitherAsync<NormaliseAudioError, string[]>((resolve, reject) => {
		const lines: string[] = []

		ffmpeg(inputPath)
			.audioFilters([
				{
					filter: 'loudnorm',
					options: [...getInputOptions(settings), 'print_format=json'],
				},
			])
			.audioQuality(320)
			.format('null')
			.on('start', command =>
				logger
					.namespace('getMetadata')
					.info(`Started normalising audio with command ${command}`),
			)
			.on('stderr', lines.push)
			.on('end', () => resolve(lines))
			.on('error', () =>
				reject(
					new NormaliseAudioError(`Failed to parse metadata for ${inputPath}`),
				),
			)
			.saveToFile('-')
	})
}
