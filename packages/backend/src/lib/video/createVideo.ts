import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import { emptySuccess, failure, type Result } from "../result";
import { logger } from "../logger";

type VideoRequest = {
  audioPath: string;
  imagePath: string;
  outputPath: string;
};

export const createVideo = async ({
  audioPath,
  imagePath,
  outputPath,
}: VideoRequest): Promise<Result> => {
  const outStream = fs.createWriteStream(outputPath);

  try {
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(imagePath)
        .loop()
        .input(audioPath)
        .audioCodec("aac")
        .audioBitrate(320)
        .videoCodec("libx264")
        .outputOption("-pix_fmt", "yuv420p")
        .outputOption("-shortest")
        .outputFormat("mp4")
        .outputOption("-movflags frag_keyframe+empty_moov")
        .on("start", (c) =>
          logger.info(`Started making video using command: ${c}`)
        )
        .on("end", () => {
          logger.info("Finished making video");
          resolve();
        })
        .on("progress", ({ timemark, percent }) =>
          logger.info(`Current timestamp: ${timemark}, percentage: ${percent}`)
        )
        .on("error", ({ message }) => {
          logger.error(message);
          reject();
        })
        .pipe(outStream, { end: true });
    });

    return emptySuccess();
  } catch (e) {
    if (e instanceof Error) {
      return failure(e.message);
    }

    return failure("An unknown error occurred");
  }
};
