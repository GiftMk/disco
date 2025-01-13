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
	const normalisedAudioFile = tempDirectory.newFile(audioFile.extension)

	const progress = { resizeImage: 0, normaliseAudio: 0 }
	const handleProgress = (
		action: 'resizeImage' | 'normaliseAudio',
		percentageComplete: number,
	) => {
		progress[action] = percentageComplete

		pubSub.publish('creatingVideo', trackingId, {
			__typename: 'CreatingVideoPayload',
			currentStep: CreatingVideoStep.ProcessingAssets,
			percentageComplete: Math.min(
				progress.resizeImage,
				progress.normaliseAudio,
			),
		})
	}

	return concurrently(
		{
			run: resizeImage({
				inputPath: imageFile.path,
				outputPath: resizedImageFile.path,
				aspectRatio: SixteenByNine,
				onProgress: percentageComplete =>
					handleProgress('resizeImage', percentageComplete),
			}),
		},
		{
			run: normaliseAudio({
				inputPath: audioFile.path,
				outputPath: normalisedAudioFile.path,
				settings: normalisation.settings ?? defaultSettings,
				onProgress: percentageComplete =>
					handleProgress('normaliseAudio', percentageComplete),
			}),
			predicate: () => normalisation.isEnabled,
		},
	).map(() => ({
		imageFile: resizedImageFile,
		audioFile: normalisation.isEnabled ? normalisedAudioFile : audioFile,
	}))
}
