import type { FileMetadata } from '../../utils/getFileMetadataData'
import { Left, Right, type Either } from 'purify-ts'

export const getAudioDuration = (
	metadata: FileMetadata,
): Either<string, number> => {
	const duration = metadata.format.duration

	if (duration === undefined) {
		return Left('Failed to get audio duration from file metadata')
	}

	return Right(duration)
}
