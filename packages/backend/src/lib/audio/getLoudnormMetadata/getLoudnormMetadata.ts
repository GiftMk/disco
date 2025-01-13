import type { LoudnormMetadata } from './LoudnormMetadata'
import { toMetadata } from './toMetadata'
import type { NormalisationSettings } from '../NormalisationSettings'
import { extractLines } from './extractLines'
import { linesToObject } from './linesToObject'
import type { EitherAsync } from 'purify-ts/EitherAsync'
import type { Failure } from '../../Failure'

export const getLoudnormMetadata = (
	inputPath: string,
	settings: NormalisationSettings,
): EitherAsync<Failure, LoudnormMetadata> => {
	return extractLines(inputPath, settings)
		.chain(async lines => linesToObject(lines))
		.chain(async object => toMetadata(object))
}
