import {
	failure,
	getValueOrThrow,
	isFailure,
	type Result,
	success,
} from '../../result'
import type { Dimensions } from './Dimensions'
import { getFileMetadata } from '../../getFileMetadataData'

export const getDimensions = async (
	imagePath: string,
): Promise<Result<Dimensions>> => {
	const metadataResult = await getFileMetadata(imagePath)
	if (isFailure(metadataResult)) {
		return metadataResult
	}

	const metadata = getValueOrThrow(metadataResult)
	const dataStream = metadata.streams[0]
	const width = dataStream?.width
	const height = dataStream?.height

	if (!width || !height) {
		return failure(`Failed to get dimensions for image '${imagePath}'`)
	}

	return success({ width, height })
}
