import { Left, Right, type Either } from 'purify-ts/Either'
import { NormaliseAudioError } from '../NormaliseAudioError'

export const linesToObject = (
	lines: string[],
): Either<NormaliseAudioError, Record<string, string>> => {
	try {
		let canRead = false
		const loudnormLines: string[] = []

		for (const line of lines) {
			if (line.includes('loudnorm')) {
				canRead = true
			} else if (canRead) {
				loudnormLines.push(line)

				if (line.includes('}')) {
					canRead = false
				}
			}
		}

		return Right(JSON.parse(loudnormLines.join('')))
	} catch {
		return Left(
			new NormaliseAudioError(
				`Failed to locate loudnorm settings from parsed json lines '${lines.join('')}'`,
			),
		)
	}
}
