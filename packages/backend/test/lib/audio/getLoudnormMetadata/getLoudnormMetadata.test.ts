import { describe, expect, it } from 'vitest'
import { pathToSampleFile } from '../../../sampleFiles/pathToSampleFile'
import { getLoudnormMetadata } from '../../../../src/lib/audio/getLoudnormMetadata'
import { expectedLoudnormMetadata } from './expectedLoudnormMetadata'

describe('extractLines', () => {
	it.each(expectedLoudnormMetadata)(
		'returns the correct loudnorm metadata for file $filename',
		{ timeout: 20_000 },
		async ({ filename, settings, metadata }) => {
			const actualMetadata = await getLoudnormMetadata(
				pathToSampleFile(filename),
				settings,
			).run()

			expect(actualMetadata.extract()).toMatchObject(metadata)
		},
	)
})
