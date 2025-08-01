import type { PubSub } from 'graphql-yoga'
import type { AssetRepository } from '../../lib/assets/AssetRepository'
import type { TempFile } from '../../lib/tempFiles/TempFile'
import type { PubSubProps } from '../../serverContext'

type UploadVideoProps = {
	pubSub: PubSub<PubSubProps>
	trackingId: string
	assetRepository: AssetRepository
	videoFile: TempFile
}

export const uploadVideo = ({
	pubSub,
	trackingId,
	assetRepository,
	videoFile,
}: UploadVideoProps) => {
	const handleProgress = (percentageComplete: number) => {
		pubSub.publish('creatingVideo', trackingId, {
			__typename: 'CreatingVideoPayload',
			percentageComplete,
		})
	}

	return assetRepository
		.upload(videoFile, handleProgress)
		.map(() => ({ videoFilename: videoFile.name }))
}
