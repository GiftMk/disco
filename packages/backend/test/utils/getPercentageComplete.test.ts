import { describe, expect, it } from 'vitest'
import { getPercentageComplete } from '../../src/utils/getPercentageComplete'

describe('getPercentageComplete', () => {
	it('returns zero if the target is zero', () => {
		expect(getPercentageComplete(98, 0)).toBe(0)
	})

	it('returns zero if target is less than zero', () => {
		expect(getPercentageComplete(98, -2)).toBe(0)
	})

	it('returns zero if target is NaN', () => {
		expect(getPercentageComplete(98, Number.NaN)).toBe(0)
	})

	it('returns zero if target is positive infinity', () => {
		expect(getPercentageComplete(12, Number.POSITIVE_INFINITY)).toBe(0)
	})

	it('returns zero if target is negative infinity', () => {
		expect(getPercentageComplete(12, Number.NEGATIVE_INFINITY)).toBe(0)
	})

	it('returns zero if current is zero', () => {
		expect(getPercentageComplete(0, 247)).toBe(0)
	})

	it('returns zero if current is less than zero', () => {
		expect(getPercentageComplete(-22, 247)).toBe(0)
	})

	it('returns zero if current is NaN', () => {
		expect(getPercentageComplete(Number.NaN, 98)).toBe(0)
	})

	it('returns zero if current is positive infinity', () => {
		expect(getPercentageComplete(Number.POSITIVE_INFINITY, 12)).toBe(0)
	})

	it('returns zero if current is negative infinity', () => {
		expect(getPercentageComplete(Number.NEGATIVE_INFINITY, 12)).toBe(0)
	})

	it('returns 100 if current is equal to target', () => {
		expect(getPercentageComplete(247, 247)).toBe(100)
	})

	it('returns 100 if current is greater than target', () => {
		expect(getPercentageComplete(250, 247)).toBe(100)
	})

	it('rounds the percentage up to the nearest integer', () => {
		expect(getPercentageComplete(3, 3.5)).toBe(86)
	})
})
