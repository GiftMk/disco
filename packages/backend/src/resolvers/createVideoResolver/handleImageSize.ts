import { GraphQLError } from 'graphql'
import { generateFilename, filePath } from '../../lib/filePath'
import { isFailure } from '../../lib/result'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'

export const handleImageSize = async (imagePath: string): Promise<string> => {
	const resizedImagePath = filePath('.outputs', generateFilename('png'))

	const resizeImageResult = await resizeImage({
		inputPath: imagePath,
		aspectRatio: SixteenByNine,
		outputPath: resizedImagePath,
	})

	if (isFailure(resizeImageResult)) {
		throw new GraphQLError(
			`Failed to resize image ${imagePath} when creating video, the follow error(s) occurred: ${resizeImageResult.error}`,
		)
	}

	return resizedImagePath
}
