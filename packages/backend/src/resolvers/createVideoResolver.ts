import { GraphQLError } from 'graphql'
import type {
	CreateVideoResponse,
	MutationCreateVideoArgs,
} from '../generated/graphql'
import { generateFilename, filePath } from '../lib/filePath'
import { isFailure, isSuccess } from '../lib/result'
import { createVideo } from '../lib/video/createVideo'
import { resizeImage } from '../lib/image/resizeImage'
import { SixteenByNine } from '../lib/image/dimensions/AspectRatio'

export const createVideoResolver = async (
	_: unknown,
	args: MutationCreateVideoArgs,
): Promise<CreateVideoResponse> => {
	const { audioFilename, imageFilename } = args.input
	const audioPath = filePath('.inputs', audioFilename)
	const imagePath = filePath('.inputs', imageFilename)
	const rezisedImagePath = filePath('.outputs', generateFilename('png'))
	const outputPath = filePath('.outputs', generateFilename('mp4'))

	const resizeImageResult = await resizeImage({
		inputPath: imagePath,
		aspectRatio: SixteenByNine,
		outputPath: rezisedImagePath,
	})

	if (isFailure(resizeImageResult)) {
		throw new GraphQLError(
			`Failed to resize image ${imageFilename} when creating video, the follow error(s) occurred: ${resizeImageResult.error}`,
		)
	}

	const createVideoResult = await createVideo({
		audioPath,
		imagePath: rezisedImagePath,
		outputPath,
	})

	if (isSuccess(createVideoResult)) {
		return { outputFilename: outputPath }
	}

	throw new GraphQLError(
		`Failed to create video, the follow error(s) occurred: ${createVideoResult.error}`,
	)
}
