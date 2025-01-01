import { Result } from '../../result'
import type { Dimensions } from './Dimensions'
import { getFileMetadata } from '../../getFileMetadataData'

export const getDimensions = async (
	imagePath: string,
): Promise<Result<Dimensions>> => {
	const metadataResult = await getFileMetadata(imagePath)

	if (metadataResult.isFailure) {
		return Result.failure(metadataResult.error)
	}

	const metadata = metadataResult.value
	const dataStream = metadata.streams[0]
	const width = dataStream?.width
	const height = dataStream?.height

	if (!width || !height) {
		return Result.failure(`Failed to get dimensions for image '${imagePath}'`)
	}

	return Result.success({ width, height })
}
