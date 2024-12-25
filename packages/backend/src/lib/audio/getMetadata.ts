import type { LoudnormMetadata } from './LoudnormMetadata'
import ffmpeg from 'fluent-ffmpeg'
import {
	type Result,
	emptySuccess,
	failure,
	getValueOrThrow,
	isFailure,
} from '../result'
import { LoudnormJsonExtractor } from './loudnormJsonExtractor'
import { getMetadataFromJson } from './getMetadataFromJson'
import type { NormalisationSettings } from './NormalisationSettings'
import { getInputOptions } from './getInputOptions'
import { logger } from '../logger'

export const getMetadata = async (
	inputPath: string,
	settings: NormalisationSettings,
): Promise<Result<LoudnormMetadata>> => {
	const loudnormJsonExtractor = new LoudnormJsonExtractor()

	try {
		const result = await new Promise<Result>((resolve, reject) => {
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
				.on('stderr', line => loudnormJsonExtractor.consume(line))
				.on('end', () => resolve(emptySuccess()))
				.on('error', e =>
					reject(failure(`Parsing metadata for ${inputPath}`, e)),
				)
				.saveToFile('-')
		})

		if (isFailure(result)) {
			return result
		}

		const extractResult = loudnormJsonExtractor.extract()
		if (isFailure(extractResult)) {
			return extractResult
		}

		const loudnormJson = getValueOrThrow(extractResult)
		return getMetadataFromJson(loudnormJson)
	} catch (e) {
		return failure(`Retrieving metadata for ${inputPath}`, e)
	}
}
