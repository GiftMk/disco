import type { PubSub } from 'graphql-yoga'
import type { TempFile } from '../../lib/tempFiles/TempFile'
import { createVideo } from '../../lib/video/createVideo'
import type { PubSubProps } from '../../serverContext'
import type { TempDirectory } from '../../lib/tempFiles/TempDirectory'

type ProduceVideoProps = {
	pubSub: PubSub<PubSubProps>
	trackingId: string
	audioFile: TempFile
	imageFile: TempFile
	tempDirectory: TempDirectory
}

export const produceVideo = ({
	pubSub,
	trackingId,
	audioFile,
	imageFile,
	tempDirectory,
}: ProduceVideoProps) => {
	const videoFile = tempDirectory.newFile('mp4')

	pubSub.publish('creatingVideo', trackingId, {
		__typename: 'CreatingVideoPayload',
		percentageComplete: 0,
	})

	return createVideo({
		audioPath: audioFile.path,
		imagePath: imageFile.path,
		outputPath: videoFile.path,
		onProgress: percentageComplete =>
			pubSub.publish('creatingVideo', trackingId, {
				__typename: 'CreatingVideoPayload',
				percentageComplete,
			}),
	}).map(() => ({ videoFile }))
}
