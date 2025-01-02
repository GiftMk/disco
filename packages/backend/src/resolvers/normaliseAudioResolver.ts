import type {
  MutationNormaliseAudioArgs,
  NormaliseAudioError,
  NormaliseAudioPayload,
  NormaliseAudioResponse,
} from '../generated/graphql'
import { normaliseAudio } from '../lib/audio/normaliseAudio'
import { tempFile } from '../utils/tempFile'
import { generateFilename } from '../utils/generateFilename'
import { defaultSettings } from '../lib/audio/defaultSettings'

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
    settings: settings ?? defaultSettings,
  })
    .map<NormaliseAudioPayload>(() => ({
      __typename: 'NormaliseAudioPayload',
      outputFilename: outputPath,
    }))
    .mapLeft<NormaliseAudioError>(message => ({
      __typename: 'NormaliseAudioError',
      message,
    }))
    .run()

  return result.extract()
}
