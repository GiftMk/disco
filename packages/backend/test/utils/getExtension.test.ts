import { describe, expect, it } from 'vitest'
import { getExtension } from '../../src/utils/getExtension'

describe('getExtension', () => {
	it('returns the extension without a leading dot', () => {
		const filename = 'foo.bar.txt'

		expect(getExtension(filename)).toBe('txt')
	})

	it.each([
		{ filePath: '/dirA/dirB/dirC/file.mp3', extension: 'mp3' },
		{ filePath: '\\foo\\bar\\baz.jpg', extension: 'jpg' },
	])(
		'returns the extension $extension from the multi-directory file path $filePath',
		({ filePath, extension }) => {
			expect(getExtension(filePath)).toBe(extension)
		},
	)

	it('returns an empty string if the file does not have an extension', () => {
		const filename = 'file'

		expect(getExtension(filename)).toBe('')
	})

	it.each([
		{ value: '\r', label: 'carriage return' },
		{ value: '\n', label: 'newline' },
		{ value: ' ', label: 'space' },
		{ value: '', label: 'empty string' },
		{ value: '\t', label: 'tab' },
	])('returns an empty string when given $label', ({ value }) => {
		expect(getExtension(value)).toBe('')
	})
})
