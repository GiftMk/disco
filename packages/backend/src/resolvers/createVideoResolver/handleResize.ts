import { tempFile } from '../../lib/tempFile'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'
import { generateFilename } from '../../lib/generateFilename'
import { Result } from '../../lib/result'

export const handleResize = async (
	imagePath: string,
): Promise<Result<string>> => {
	const outputPath = tempFile(generateFilename('png'))

	const result = await resizeImage({
		inputPath: imagePath,
		aspectRatio: SixteenByNine,
		outputPath,
	})

	if (result.isFailure) {
		return Result.failure(result.error)
	}

	return Result.success(outputPath)
}
