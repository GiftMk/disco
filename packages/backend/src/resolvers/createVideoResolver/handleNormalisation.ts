import { tempFile } from '../../lib/tempFile'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import type { NormalisationSettings } from '../../lib/audio/NormalisationSettings'
import { generateFilename } from '../../lib/generateFilename'
import { Result } from '../../lib/result'

export const handleNormalisation = async (
	isEnabled: boolean,
	audioPath: string,
	settings?: NormalisationSettings,
): Promise<Result<string>> => {
	if (!isEnabled) return Result.success(audioPath)

	const outputPath = tempFile(generateFilename('mp3'))
	const result = await normaliseAudio({
		inputPath: audioPath,
		outputPath,
		settings,
	})

	if (result.isFailure) {
		return Result.failure(result.error)
	}

	return Result.success(outputPath)
}
