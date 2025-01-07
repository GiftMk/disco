import type { FileMetadata } from '../../utils/getFileMetadataData'
import { Left, Right, type Either } from 'purify-ts'
import { Failure } from '../Failure'

export const getAudioDuration = (
	metadata: FileMetadata,
): Either<Failure, number> => {
	const duration = metadata.format.duration

	if (duration === undefined) {
		return Left(new Failure('Failed to get audio duration from file metadata'))
	}

	return Right(duration)
}
