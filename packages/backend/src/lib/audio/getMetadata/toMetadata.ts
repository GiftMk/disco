import type { LoudnormMetadata } from './LoudnormMetadata'
import { Left, Right, type Either } from 'purify-ts/Either'

export const toMetadata = (
  json: Record<string, string>,
): Either<string, LoudnormMetadata> => {
  try {
    return Right({
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
  } catch {
    return Left(`Failed to convert ${json} into Loudnorm metadata`)
  }
}
