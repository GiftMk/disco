import { GraphQLError } from 'graphql'
import type {
	MutationNormaliseAudioArgs,
	NormaliseAudioResponse,
} from '../generated/graphql'
import { normaliseAudio } from '../lib/audio/normaliseAudio'
import { tempFile } from '../lib/tempFile'
import { generateFilename } from '../lib/generateFilename'

export const normaliseAudioResolver = async (
	_: unknown,
	args: MutationNormaliseAudioArgs,
): Promise<NormaliseAudioResponse> => {
	const { audioFilename, settings } = args.input
	const inputPath = tempFile(audioFilename)
	const outputPath = tempFile(generateFilename('mp3'))

	const result = await normaliseAudio({
		inputPath,
		outputPath,
		settings: settings ?? undefined,
	})

	result.ifFailure(failure => {
		throw new GraphQLError(failure.toString())
	})

	return { outputFilename: outputPath }
}
