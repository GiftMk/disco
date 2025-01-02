import { logger } from '../../logger'
import { toEitherAsync } from '../../toEitherAsync'
import { getInputOptions } from '../getInputOptions'
import type { NormalisationSettings } from '../NormalisationSettings'
import ffmpeg from 'fluent-ffmpeg'
import type { EitherAsync } from 'purify-ts/EitherAsync'

export const extractLines = (
	inputPath: string,
	settings: NormalisationSettings,
): EitherAsync<string, string[]> => {
	return toEitherAsync<string, string[]>((resolve, reject) => {
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
			.on('error', e => reject(`Failed to parse metadata for ${inputPath}`))
			.saveToFile('-')
	})
}
