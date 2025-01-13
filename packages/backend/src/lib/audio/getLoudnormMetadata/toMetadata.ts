import { logger } from '../../../logger'
import { Failure } from '../../Failure'
import type { LoudnormMetadata } from './LoudnormMetadata'
import { Left, Right, type Either } from 'purify-ts/Either'

const toNumber = (value: unknown): number => {
	const number = Number(value)

	if (!Number.isFinite(number)) {
		throw new Error(`Value ${value} cannot be converted into a finite number.`)
	}

	return number
}

export const toMetadata = (
	json: Record<string, string>,
): Either<Failure, LoudnormMetadata> => {
	try {
		return Right({
			inputIntegrated: toNumber(json.input_i),
			inputTruePeak: toNumber(json.input_tp),
			inputLoudnessRange: toNumber(json.input_lra),
			inputThreshold: toNumber(json.input_thresh),
			outputIntegrated: toNumber(json.output_i),
			outputTruePeak: toNumber(json.output_tp),
			outputLoudnessRange: toNumber(json.output_lra),
			outputThreshold: toNumber(json.output_thresh),
			normalisationType: json.normalization_type || '',
			targetOffset: toNumber(json.target_offset),
		})
	} catch (e) {
		logger.error(e instanceof Error ? e.message : 'An unknown error occurred.')
		return Left(new Failure(`Failed to convert ${json} into Loudnorm metadata`))
	}
}
