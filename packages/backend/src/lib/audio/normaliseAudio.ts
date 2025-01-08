import { getLoudnormMetadata } from './getMetadata/getLoudnormMetadata'
import type { NormalisationSettings } from './NormalisationSettings'
import type { LoudnormMetadata } from './getMetadata'
import { toEitherAsync } from '../../utils/eitherAsync'
import ffmpeg from 'fluent-ffmpeg'
import { getInputOptions } from './getInputOptions'
import { logger } from '../../logger'
import type { EitherAsync } from 'purify-ts'
import { Failure } from '../Failure'
import { getFileMetadata } from '../../utils/getFileMetadataData'
import { getAudioDuration } from '../video/getAudioDuration'
import { getPercentageComplete } from '../video/getPercentageComplete'

type NormaliseAudioProps = {
	inputPath: string
	outputPath: string
	settings: NormalisationSettings
	onProgress?: (percentageComplete: number) => void
}

type ExecuteProps = NormaliseAudioProps & {
	loudnormMetadata: LoudnormMetadata
	audioDuration: number
}

const execute = ({
	inputPath,
	outputPath,
	settings,
	loudnormMetadata,
	audioDuration,
	onProgress,
}: ExecuteProps): EitherAsync<Failure, void> => {
	return toEitherAsync((resolve, reject) =>
		ffmpeg(inputPath)
			.audioFilters([
				{
					filter: 'loudnorm',
					options: [
						...getInputOptions(settings),
						'print_format=json',
						`measured_I=${loudnormMetadata.inputIntegrated}`,
						`measured_LRA=${loudnormMetadata.inputLoudnessRange}`,
						`measured_TP=${loudnormMetadata.inputTruePeak}`,
						`measured_thresh=${loudnormMetadata.inputThreshold}`,
						`offset=${loudnormMetadata.targetOffset}`,
						'linear=true',
					],
				},
			])
			.audioBitrate(320)
			.on('start', command =>
				logger
					.namespace('normaliseAudio')
					.info(`Started normalising audio with command ${command}`),
			)
			.on('end', () => resolve())
			.on('progress', ({ timemark }) => {
				getPercentageComplete(timemark, audioDuration).ifJust(
					percentageComplete => {
						logger.info(`Percentage complete: ${percentageComplete}`)
						onProgress?.(percentageComplete)
					},
				)
			})
			.on('error', (e: Error) => {
				logger.error(e.message)

				reject(new Failure(`Failed to normalise audio ${inputPath}`))
			})
			.saveToFile(outputPath),
	)
}

export const normaliseAudio = (
	props: NormaliseAudioProps,
): EitherAsync<Failure, void> => {
	const { inputPath, settings } = props
	return getFileMetadata(inputPath)
		.chain(async fileMetadata => getAudioDuration(fileMetadata))
		.chain(audioDuration =>
			getLoudnormMetadata(inputPath, settings).map(loudnormMetadata => ({
				loudnormMetadata,
				audioDuration,
			})),
		)
		.chain(({ loudnormMetadata, audioDuration }) =>
			execute({ ...props, loudnormMetadata, audioDuration }),
		)
}
