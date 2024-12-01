import ffmpeg from "fluent-ffmpeg";
import {
  type Result,
  emptySuccess,
  failure,
  getValueOrThrow,
  isFailure,
} from "../result";
import { getMetadata } from "./getMetadata";
import type { NormalisationSettings } from "./NormalisationSettings";
import { getInputOptions } from "./getInputOptions";
import { logger } from "../logger";

const defaultSettings: Readonly<NormalisationSettings> = {
  integrated: -16,
  truePeak: -1.5,
  loudnessRange: 11,
};

export const normaliseAudio = async (
  inputPath: string,
  outputPath: string,
  settings: NormalisationSettings = defaultSettings
): Promise<Result> => {
  const metadataResult = await getMetadata(inputPath, settings);
  if (isFailure(metadataResult)) {
    return metadataResult;
  }
  const metadata = getValueOrThrow(metadataResult);

  return await new Promise<Result>((resolve, reject) =>
    ffmpeg(inputPath)
      .audioFilters([
        {
          filter: "loudnorm",
          options: [
            ...getInputOptions(settings),
            "print_format=json",
            `measured_I=${metadata.inputIntegrated}`,
            `measured_LRA=${metadata.inputLoudnessRange}`,
            `measured_TP=${metadata.inputTruePeak}`,
            `measured_thresh=${metadata.inputThreshold}`,
            `offset=${metadata.targetOffset}`,
            "linear=true",
          ],
        },
      ])
      .audioBitrate(320)
      .on("start", (command) =>
        logger
          .namespace("normaliseAudio")
          .info(`Started normalising audio with command ${command}`)
      )
      .on("end", () => resolve(emptySuccess()))
      .on("error", (e) => reject(failure(e.message)))
      .saveToFile(outputPath)
  );
};
