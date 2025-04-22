import type { PubSub } from 'graphql-yoga'
import type { AssetRepository } from '../../lib/assets/AssetRepository'
import { concurrently } from '../../utils/eitherAsync'
import type { PubSubProps } from '../../serverContext'
import type { TempDirectory } from '../../lib/tempFiles/TempDirectory'
import { getExtension } from '../../utils/getExtension'

type DownloadAssetsProps = {
	pubSub: PubSub<PubSubProps>
	trackingId: string
	assetRepository: AssetRepository
	tempDirectory: TempDirectory
	audioFilename: string
	imageFilename: string
}

export const downloadAssets = ({
	pubSub,
	trackingId,
	assetRepository,
	tempDirectory,
	audioFilename,
	imageFilename,
}: DownloadAssetsProps) => {
	const audioFile = tempDirectory.newFile(getExtension(audioFilename))
	const imageFile = tempDirectory.newFile(getExtension(imageFilename))

	pubSub.publish('creatingVideo', trackingId, {
		__typename: 'CreatingVideoPayload',
	})

	return concurrently(
		{ run: assetRepository.download(audioFilename, audioFile) },
		{ run: assetRepository.download(imageFilename, imageFile) },
	).map(() => ({ audioFile, imageFile }))
}
