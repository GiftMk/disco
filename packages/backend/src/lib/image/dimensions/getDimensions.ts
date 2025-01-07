import type { Dimensions } from './Dimensions'
import type { FileMetadata } from '../../../utils/getFileMetadataData'
import { Left, Right, type Either } from 'purify-ts/Either'
import { Failure } from '../../Failure'

export const getDimensions = (
	fileMetadata: FileMetadata,
): Either<Failure, Dimensions> => {
	const dataStream = fileMetadata.streams[0]
	const width = dataStream?.width
	const height = dataStream?.height

	if (!width || !height) {
		return Left(
			new Failure(
				`Failed to get width and height from data stream'${dataStream}'`,
			),
		)
	}

	return Right({ width, height })
}
