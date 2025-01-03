import type { LoudnormMetadata } from './LoudnormMetadata'
import { toMetadata } from './toMetadata'
import type { NormalisationSettings } from '../NormalisationSettings'
import { extractLines } from './extractLines'
import { linesToObject } from './toObject'
import type { EitherAsync } from 'purify-ts/EitherAsync'
import type { NormaliseAudioError } from '../NormaliseAudioError'

export const getMetadata = (
	inputPath: string,
	settings: NormalisationSettings,
): EitherAsync<NormaliseAudioError, LoudnormMetadata> => {
	return extractLines(inputPath, settings)
		.chain(async lines => linesToObject(lines))
		.chain(async object => toMetadata(object))
}
