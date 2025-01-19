import type { FileMetadata } from './getFileMetadata'
import { Left, Right, type Either } from 'purify-ts'
import { Failure } from '../Failure'

export const getFileDuration = (
	metadata: FileMetadata,
): Either<Failure, number> => {
	const duration = metadata.format.duration

	if (duration === undefined) {
		return Left(new Failure('Failed to get audio duration from file metadata'))
	}

	return Right(duration)
}
