import { describe, expect, it, vi, beforeAll, afterAll } from 'vitest'
import {
	concurrently,
	LeftAsync,
	RightAsync,
	toEitherAsync,
} from '../../src/utils/eitherAsync'
import { Failure } from '../../src/lib/Failure'

describe('eitherAsyncUtils', () => {
	describe('RightAsync', () => {
		it('Returns the given value in an either async of type right', async () => {
			const value = 22
			const either = await RightAsync(value)

			expect(either.isRight()).toBe(true)

			expect(either.extract()).toBe(value)
		})
	})

	describe('LeftAsync', () => {
		it('Returns the given value in an either async of type left', async () => {
			const failure = new Failure('something went wrong')
			const either = await LeftAsync(failure)

			expect(either.isLeft()).toBe(true)

			expect(either.extract()).toBe(failure)
		})
	})

	describe('toEitherAsync', () => {
		it('Returns a right either when the async callback is successful', async () => {
			const value = 'very successful'
			const either = await toEitherAsync(right =>
				new Promise<void>(resolve => resolve()).then(() => right(value)),
			).run()

			expect(either.isRight()).toBe(true)
			expect(either.extract()).toBe(value)
		})

		it('Returns a left either when the async callback fails', async () => {
			const value = 'very unsuccessful'
			const either = await toEitherAsync((_, left) =>
				new Promise<void>(resolve => resolve()).then(() => left(value)),
			).run()

			expect(either.isLeft()).toBe(true)
			expect(either.extract()).toBe(value)
		})

		it('Returns a left either containing the rejected value when the async callback rejects', async () => {
			const value = 'very unsuccessful'
			const either = await toEitherAsync(
				() => new Promise<void>((_, reject) => reject(value)),
			).run()

			expect(either.isLeft()).toBe(true)
			expect(either.extract()).toBe(value)
		})

		it('Returns a left either containing the error when the callback throws', async () => {
			const error = new Error('NOPE')
			const either = await toEitherAsync(() => {
				throw error
			}).run()

			expect(either.isLeft()).toBe(true)
			expect(either.extract()).toBe(error)
		})
	})

	describe('concurrently', () => {
		beforeAll(() => vi.useFakeTimers())
		afterAll(() => vi.useRealTimers())

		const sleep = (delayMs: number) =>
			new Promise<void>(resolve => setTimeout(() => resolve(), delayMs))

		const mockAsyncSuccess = <T>(delayMs: number, value: T) => {
			return toEitherAsync(async right => {
				sleep(delayMs)
				right(value)
			})
		}

		const mockAsyncFailure = <T>(delayMs: number, value: T) => {
			return toEitherAsync(async (_, left) => {
				sleep(delayMs)
				left(value)
			})
		}

		it('runs all callbacks concurrently', async () => {
			const delayMs = 5000

			const valuesPromise = concurrently(
				{ run: mockAsyncSuccess(delayMs, 'hello') },
				{ run: mockAsyncSuccess(delayMs, 'world') },
			).run()

			vi.advanceTimersByTimeAsync(delayMs)

			const values = await valuesPromise

			expect(values.extract()).toStrictEqual(['hello', 'world'])
		})

		it('runs a callbacks when their predicates resolve to false', async () => {
			const delayMs = 5000

			const valuesPromise = concurrently(
				{ run: mockAsyncSuccess(delayMs, 'foo') },
				{ run: mockAsyncSuccess(delayMs, 'bar'), predicate: () => false },
				{ run: mockAsyncSuccess(delayMs, 'baz'), predicate: () => false },
			).run()

			vi.advanceTimersByTimeAsync(delayMs)

			const values = await valuesPromise

			expect(values.extract()).toStrictEqual(['foo'])
		})

		it('runs a callback with a predicate that resolves to true', async () => {
			const delayMs = 5000

			const valuesPromise = concurrently(
				{ run: mockAsyncSuccess(delayMs, 'foo') },
				{ run: mockAsyncSuccess(delayMs, 'bar'), predicate: () => true },
				{ run: mockAsyncSuccess(delayMs, 'baz'), predicate: () => true },
			).run()

			vi.advanceTimersByTimeAsync(delayMs)

			const values = await valuesPromise

			expect(values.extract()).toStrictEqual(['foo', 'bar', 'baz'])
		})

		it('returns a left either when a callback fails', async () => {
			const delayMs = 5000
			const error = 'something went wrong!'

			const valuesPromise = concurrently(
				{ run: mockAsyncSuccess(delayMs, 'foo') },
				{ run: mockAsyncFailure(delayMs, error) },
				{ run: mockAsyncSuccess(delayMs, 'baz') },
			).run()

			vi.advanceTimersByTimeAsync(delayMs)

			const values = await valuesPromise

			expect(values.extract()).toStrictEqual(error)
		})
	})
})
