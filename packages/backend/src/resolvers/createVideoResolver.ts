import { GraphQLError } from "graphql";
import type {
  CreateVideoResponse,
  MutationCreateVideoArgs,
} from "../generated/graphql";
import { generateFilename, filePath } from "../lib/filePath";
import { isSuccess } from "../lib/result";
import { createVideo } from "../lib/video/createVideo";

export const createVideoResolver = async (
  _: unknown,
  args: MutationCreateVideoArgs
): Promise<CreateVideoResponse> => {
  const { audioFilename, imageFilename } = args.input;
  const audioPath = filePath(".input", audioFilename);
  const imagePath = filePath(".input", imageFilename);
  const outputPath = filePath(".output", generateFilename("mp4"));

  const result = await createVideo({ audioPath, imagePath, outputPath });

  if (isSuccess(result)) {
    return { outputFilename: outputPath };
  }

  throw new GraphQLError(
    `Failed to create video, the follow error(s) occurred: ${result.error}`
  );
};
