import type {
	MutationNormaliseAudioArgs,
	NormaliseAudioPayload,
	NormaliseAudioResponse,
} from '../generated/graphql'
import { normaliseAudio } from '../lib/audio/normaliseAudio'
import { defaultSettings } from '../lib/audio/defaultSettings'
import { logger } from '../logger'
import { getExtension } from '../utils/getExtension'
import type { ServerContext } from '../serverContext'

export const normaliseAudioResolver = async (
	_: unknown,
	args: MutationNormaliseAudioArgs,
	context: ServerContext,
): Promise<NormaliseAudioResponse> => {
	const { audioFilename, settings } = args.input
	const { assetRepository, tempDirectoryRepository } = context
	using tempDirectory = tempDirectoryRepository.newDirectory()

	const audioExtension = getExtension(audioFilename)
	const audioFile = tempDirectory.newFile(audioExtension)
	const outputFile = tempDirectory.newFile(audioExtension)

	const response = await assetRepository
		.download(audioFilename, audioFile)
		.chain(() =>
			normaliseAudio({
				inputPath: audioFile.path,
				outputPath: outputFile.path,
				settings: settings ?? defaultSettings,
			}),
		)
		.chain(() => assetRepository.upload(outputFile))
		.map<NormaliseAudioPayload>(() => ({
			__typename: 'NormaliseAudioPayload',
			outputFilename: outputFile.name,
		}))
		.mapLeft(e => ({
			__typename: e.type,
			message: e.message,
		}))
		.ifLeft(e => logger.error(e.message))
		.run()

	return response.extract()
}
