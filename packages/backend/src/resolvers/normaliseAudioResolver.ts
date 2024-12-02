import { GraphQLError } from 'graphql'
import type {
	MutationNormaliseAudioArgs,
	NormaliseAudioResponse,
} from '../generated/graphql'
import { normaliseAudio } from '../lib/audio/normaliseAudio'
import { isSuccess } from '../lib/result'
import { filePath, generateFilename } from '../lib/filePath'

export const normaliseAudioResolver = async (
	_: unknown,
	args: MutationNormaliseAudioArgs,
): Promise<NormaliseAudioResponse> => {
	const { audioFilename, settings } = args.input
	const inputPath = filePath('.inputs', audioFilename)
	const outputPath = filePath('.outputs', generateFilename('mp3'))

	const result = await normaliseAudio({
		inputPath,
		outputPath,
		settings: settings ?? undefined,
	})

	if (isSuccess(result)) {
		return { outputFilename: outputPath }
	}

	throw new GraphQLError(
		`Failed to normalise audio, the follow error(s) occurred: ${result.error}`,
	)
}
