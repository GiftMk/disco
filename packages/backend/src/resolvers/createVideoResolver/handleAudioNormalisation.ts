import { GraphQLError } from 'graphql'
import { generateFilename, filePath } from '../../lib/filePath'
import { isFailure } from '../../lib/result'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import type { NormalisationSettings } from '../../lib/audio/NormalisationSettings'

export const handleAudioNormalisation = async (
	isEnabled: boolean,
	audioPath: string,
	settings?: NormalisationSettings,
): Promise<string | null> => {
	if (!isEnabled) return null

	const normalisedAudioPath = filePath('.outputs', generateFilename('mp3'))
	const normaliseAudioResult = await normaliseAudio({
		inputPath: audioPath,
		outputPath: normalisedAudioPath,
		settings,
	})

	if (isFailure(normaliseAudioResult)) {
		throw new GraphQLError(
			`Failed to normalise audio ${audioPath}, the following error(s) occurredL ${normaliseAudioResult.error}`,
		)
	}

	return normalisedAudioPath
}
