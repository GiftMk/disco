import { describe, expect, it } from 'vitest'
import { getFileMetadata } from '../../../src/lib/commons/getFileMetadata'
import { pathToSampleFile } from '../../sampleFiles/pathToSampleFile'
import { expectedFileMetadata } from './expectedFileMetadata'

describe('getFileMetadata', () => {
	it.each(expectedFileMetadata)(
		'returns the correct file metadata for file $filename',
		async ({ filename, metadata }) => {
			const actualMetadata = await getFileMetadata(
				pathToSampleFile(filename),
			).run()

			expect(actualMetadata.extract()).toMatchObject(metadata)
		},
	)
})
