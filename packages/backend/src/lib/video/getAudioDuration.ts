import type { FileMetadata } from '../../utils/getFileMetadataData'
import { Left, Right, type Either } from 'purify-ts'
import { CreateVideoError } from './CreateVideoError'

export const getAudioDuration = (
	metadata: FileMetadata,
): Either<CreateVideoError, number> => {
	const duration = metadata.format.duration

	if (duration === undefined) {
		return Left(
			new CreateVideoError('Failed to get audio duration from file metadata'),
		)
	}

	return Right(duration)
}
