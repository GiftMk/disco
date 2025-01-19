import { describe, expect, it } from 'vitest'
import { getFileDuration } from '../../../src/lib/commons/getFileDuration'
import type { FileMetadata } from '../../../src/lib/commons/getFileMetadata'

describe('getFileDuration', () => {
	it('returns the file duration if present', () => {
		const duration = 20
		const metadata: FileMetadata = {
			format: { duration },
			streams: [],
			chapters: [],
		}

		const durationEither = getFileDuration(metadata)

		expect(durationEither.isRight()).toBe(true)
		expect(durationEither.extract()).toBe(duration)
	})

	it('returns an error if the duration is not present', () => {
		const metadata: FileMetadata = {
			format: {},
			streams: [],
			chapters: [],
		}

		const durationEither = getFileDuration(metadata)

		expect(durationEither.isLeft()).toBe(true)
	})
})
