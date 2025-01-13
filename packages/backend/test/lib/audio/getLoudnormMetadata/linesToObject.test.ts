import { describe, expect, it } from 'vitest'
import { linesToObject } from '../../../../src/lib/audio/getLoudnormMetadata/linesToObject'

describe('toObject', () => {
	it('can extract the loudnorm json from log lines', () => {
		const lines = [
			'random logs',
			'things have been happening',
			'do not touch',
			'progress: 2000%',
			'loudnorm',
			'{',
			'"input_i": "5",',
			'"input_tp": "5",',
			'"input_lra": "5",',
			'"input_thresh": "5",',
			'"output_i": "5",',
			'"output_tp": "5",',
			'"output_lra": "5",',
			'"output_thresh": "5",',
			'"normalization_type": "foobar",',
			'"target_offset": "5"',
			'}',
			'more logs',
		]

		const jsonEither = linesToObject(lines)
		expect(jsonEither.isRight()).toBe(true)

		const json = jsonEither.extract()
		expect(json).toStrictEqual({
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
	})

	it('returns an error when the json cannot be found', () => {
		const lines = [
			'random logs',
			'things have been happening',
			'do not touch',
			'progress: 2000%',
			'loudnorm',
			'more logs',
		]

		const jsonEither = linesToObject(lines)
		expect(jsonEither.isLeft()).toBe(true)
	})
})
