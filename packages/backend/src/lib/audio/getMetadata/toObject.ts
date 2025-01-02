import { Left, Right, type Either } from 'purify-ts/Either'

export const linesToObject = (
	lines: string[],
): Either<string, Record<string, string>> => {
	try {
		return Right(JSON.parse(lines.join('')))
	} catch {
		return Left(
			`Failed to locate loudnorm settings from parsed json lines ${lines.join('')}`,
		)
	}
}
