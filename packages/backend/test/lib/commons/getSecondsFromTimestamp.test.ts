import { describe, expect, it } from 'vitest'
import { getSecondsFromTimestamp } from '../../../src/lib/commons/getSecondsFromTimestamp'

describe('getSecondsFromTimestamp', () => {
	it.each(['00:01:foo', 'baz:05:30', '01:bar:45', '\r\n  ', 'random'])(
		'returns a none value when given an invalid timestamp %s',
		invalidTimestamp => {
			expect(getSecondsFromTimestamp(invalidTimestamp).isNothing()).toBe(true)
		},
	)

	it.each([
		{ timestamp: '00:00:00', seconds: 0 },
		{ timestamp: '00:00:30', seconds: 30 },
		{ timestamp: '00:01:30', seconds: 90 },
		{ timestamp: '05:00:45', seconds: 18045 },
	])(
		'returns a value of $seconds given a timestamp $timestamp',
		({ timestamp, seconds }) => {
			const secondsMaybe = getSecondsFromTimestamp(timestamp)

			expect(secondsMaybe.isJust()).toBe(true)
			expect(secondsMaybe.extract()).toBe(seconds)
		},
	)
})
