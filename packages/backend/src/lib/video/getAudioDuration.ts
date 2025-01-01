import { getFileMetadata } from '../getFileMetadataData'
import { Maybe } from '../result'

export const getAudioDurationInSeconds = async (
	audioPath: string,
): Promise<Maybe<number>> => {
	const metadataResult = await getFileMetadata(audioPath)

	if (metadataResult.isFailure) {
		return Maybe.none()
	}

	const metadata = metadataResult.value
	const duration = metadata.format.duration

	if (duration === undefined) {
		return Maybe.none()
	}

	return Maybe.from(duration)
}
