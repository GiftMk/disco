import type { PubSub } from 'graphql-yoga'
import type { TempFile } from '../../lib/tempFiles/TempFile'
import type { PubSubProps } from '../../serverContext'
import {
	CreatingVideoStep,
	type NormaliseAudioSettings,
} from '../../generated/graphql'
import { concurrently } from '../../utils/eitherAsync'
import { resizeImage } from '../../lib/image/resizeImage'
import { SixteenByNine } from '../../lib/image/dimensions/AspectRatio'
import { defaultSettings } from '../../lib/audio/defaultSettings'
import { normaliseAudio } from '../../lib/audio/normaliseAudio'
import type { TempDirectory } from '../../lib/tempFiles/TempDirectory'

type DownloadAssetsProps = {
	pubSub: PubSub<PubSubProps>
	trackingId: string
	tempDirectory: TempDirectory
	audioFile: TempFile
	imageFile: TempFile
	normalisation: {
		settings?: NormaliseAudioSettings | null
		isEnabled: boolean
	}
}

export const processAssets = ({
	pubSub,
	trackingId,
	tempDirectory,
	audioFile,
	imageFile,
	normalisation,
}: DownloadAssetsProps) => {
	const resizedImageFile = tempDirectory.newFile(imageFile.extension)
	const normalisedAudioFile = tempDirectory.newFile('mp3')

	const handleProgress = (percentageComplete: number) => {
		pubSub.publish('creatingVideo', trackingId, {
			__typename: 'CreatingVideoPayload',
			currentStep: CreatingVideoStep.ProcessingAssets,
			percentageComplete,
		})
	}

	return concurrently(
		{
			run: resizeImage({
				inputPath: imageFile.path,
				outputPath: resizedImageFile.path,
				aspectRatio: SixteenByNine,
			}),
		},
		{
			run: normaliseAudio({
				inputPath: audioFile.path,
				outputPath: normalisedAudioFile.path,
				settings: normalisation.settings ?? defaultSettings,
				onProgress: handleProgress,
			}),
			predicate: () => normalisation.isEnabled,
		},
	).map(() => ({
		imageFile: resizedImageFile,
		audioFile: normalisation.isEnabled ? normalisedAudioFile : audioFile,
	}))
}
