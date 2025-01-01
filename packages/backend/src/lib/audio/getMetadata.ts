import type { LoudnormMetadata } from './LoudnormMetadata'
import ffmpeg from 'fluent-ffmpeg'
import { asyncResult, Result } from '../result'
import { LoudnormJsonExtractor } from './loudnormJsonExtractor'
import { getMetadataFromJson } from './getMetadataFromJson'
import type { NormalisationSettings } from './NormalisationSettings'
import { getInputOptions } from './getInputOptions'
import { logger } from '../logger'

export const getMetadata = async (
	inputPath: string,
	settings: NormalisationSettings,
): Promise<Result<LoudnormMetadata>> => {
	const jsonExtractor = new LoudnormJsonExtractor()

	const ingestionResult = await asyncResult<void>((resolve, reject) => {
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
			.on('stderr', line => jsonExtractor.ingest(line))
			.on('end', () => resolve())
			.on('error', e => reject(`Failed to parse metadata for ${inputPath}`))
			.saveToFile('-')
	})

	if (ingestionResult.isFailure) {
		return Result.failure(ingestionResult.error)
	}

	const extractionResult = jsonExtractor.extract()

	if (extractionResult.isFailure) {
		return Result.failure(extractionResult.error)
	}

	return getMetadataFromJson(extractionResult.value)
}
