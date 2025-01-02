import type { Dimensions } from './Dimensions'
import type { FileMetadata } from '../../getFileMetadataData'
import { Left, Right, type Either } from 'purify-ts/Either'

export const getDimensions = (
	fileMetadata: FileMetadata,
): Either<string, Dimensions> => {
	const dataStream = fileMetadata.streams[0]
	const width = dataStream?.width
	const height = dataStream?.height

	if (!width || !height) {
		return Left(
			`Failed to get width and height from data stream'${dataStream}'`,
		)
	}

	return Right({ width, height })
}
