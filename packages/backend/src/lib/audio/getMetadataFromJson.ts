import { Result } from '../result'
import type { LoudnormMetadata } from './LoudnormMetadata'

export const getMetadataFromJson = (
	json: Record<string, string>,
): Result<LoudnormMetadata> => {
	try {
		return Result.success({
			inputIntegrated: Number(json.input_i),
			inputTruePeak: Number(json.input_tp),
			inputLoudnessRange: Number(json.input_lra),
			inputThreshold: Number(json.input_thresh),
			outputIntegrated: Number(json.output_i),
			outputTruePeak: Number(json.output_tp),
			outputLoudnessRange: Number(json.output_lra),
			outputThreshold: Number(json.output_thresh),
			normalisationType: json.normalization_type || '',
			targetOffset: Number(json.target_offset),
		})
	} catch (e) {
		return Result.failure(`Failed to convert ${json} into Loudnorm metadata`)
	}
}
