import { Left, Right, type Either } from 'purify-ts/Either'
import { NormaliseAudioError } from '../NormaliseAudioError'

export const linesToObject = (
	lines: string[],
): Either<NormaliseAudioError, Record<string, string>> => {
	try {
		return Right(JSON.parse(lines.join('')))
	} catch {
		return Left(
			new NormaliseAudioError(
				`Failed to locate loudnorm settings from parsed json lines ${lines.join('')}`,
			),
		)
	}
}
