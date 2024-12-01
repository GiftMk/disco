import { type Result, success, failure } from "../result";
import type { LoudnormMetadata } from "./LoudnormMetadata";

export const getMetadataFromJson = (json: {
  [key: string]: string;
}): Result<LoudnormMetadata> => {
  try {
    return success({
      inputIntegrated: Number(json.input_i),
      inputTruePeak: Number(json.input_tp),
      inputLoudnessRange: Number(json.input_lra),
      inputThreshold: Number(json.input_thresh),
      outputIntegrated: Number(json.output_i),
      outputTruePeak: Number(json.output_tp),
      outputLoudnessRange: Number(json.output_lra),
      outputThreshold: Number(json.output_thresh),
      normalisationType: json.normalization_type || "",
      targetOffset: Number(json.target_offset),
    });
  } catch (e) {
    if (e instanceof Error) {
      return failure(
        `Failed to convert JSON ${JSON.stringify(
          json,
          null,
          2
        )} into Loudnorm metadata. The following error occurred ${e.message}`
      );
    }
    return failure(
      `Failed to convert JSON ${JSON.stringify(
        json,
        null,
        2
      )} into Loudnorm metadata. An unknown error occurred`
    );
  }
};
