import { getFileMetadata } from '../getFileMetadataData'
import {
	failure,
	getValueOrThrow,
	isFailure,
	success,
	type Result,
} from '../result'

export const getAudioDurationInSeconds = async (
	audioPath: string,
): Promise<Result<number>> => {
	const metadataResult = await getFileMetadata(audioPath)
	if (isFailure(metadataResult)) {
		return metadataResult
	}
	const metadata = getValueOrThrow(metadataResult)
	const duration = metadata.format.duration

	if (duration === undefined) {
		return failure(`Failed to retrieve duration for audio file ${audioPath}`)
	}

	return success(duration)
}
