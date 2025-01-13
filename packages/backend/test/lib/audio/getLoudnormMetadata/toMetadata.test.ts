import { describe, it, expect } from 'vitest'
import { toMetadata } from '../../../../src/lib/audio/getLoudnormMetadata/toMetadata'
import type { LoudnormMetadata } from '../../../../src/lib/audio/getLoudnormMetadata/LoudnormMetadata'

const testLoudnormJson = (): Record<string, string> => ({
	input_i: '5',
	input_tp: '5',
	input_lra: '5',
	input_thresh: '5',
	output_i: '5',
	output_tp: '5',
	output_lra: '5',
	output_thresh: '5',
	normalization_type: 'foobar',
	target_offset: '5',
})

describe('toMetadata', () => {
	describe('numeric fields', () => {
		const numericFields: { field: keyof LoudnormMetadata; jsonKey: string }[] =
			[
				{ field: 'inputIntegrated', jsonKey: 'input_i' },
				{ field: 'inputTruePeak', jsonKey: 'input_tp' },
				{ field: 'inputLoudnessRange', jsonKey: 'input_lra' },
				{ field: 'inputThreshold', jsonKey: 'input_thresh' },
				{ field: 'outputIntegrated', jsonKey: 'output_i' },
				{ field: 'outputTruePeak', jsonKey: 'output_tp' },
				{ field: 'outputLoudnessRange', jsonKey: 'output_lra' },
				{ field: 'outputThreshold', jsonKey: 'output_thresh' },
				{ field: 'targetOffset', jsonKey: 'target_offset' },
			]

		it.each(numericFields)(
			'Converts $jsonKey to a number and maps it to $field',
			({ field, jsonKey }) => {
				const json = { ...testLoudnormJson() }
				json[jsonKey] = '200'

				const metadataEither = toMetadata(json)
				expect(metadataEither.isRight()).toBe(true)

				const metadata = metadataEither.extract() as LoudnormMetadata
				expect(metadata[field]).toBe(200)
			},
		)

		it.each(numericFields)(
			'returns an error when $jsonKey is not a number',
			({ jsonKey }) => {
				const json = { ...testLoudnormJson() }
				json[jsonKey] = 'foobar'

				const metadataEither = toMetadata(json)
				expect(metadataEither.isLeft()).toBe(true)
			},
		)
	})

	describe('string fields', () => {
		it('maps the normalisation type field', () => {
			const json = { ...testLoudnormJson(), normalization_type: 'banana' }

			const metadataEither = toMetadata(json)
			expect(metadataEither.isRight()).toBe(true)

			const metadata = metadataEither.extract() as LoudnormMetadata
			expect(metadata.normalisationType).toBe('banana')
		})

		it('sets the normalisation type to an empty string when undefined', () => {
			const json = testLoudnormJson()
			// biome-ignore lint/performance/noDelete: valid use-case of delete, object serves as a map
			delete json.normalization_type

			const metadataEither = toMetadata(json)
			expect(metadataEither.isRight()).toBe(true)

			const metadata = metadataEither.extract() as LoudnormMetadata
			expect(metadata.normalisationType).toBe('')
		})
	})
})
