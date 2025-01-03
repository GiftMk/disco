import { EitherAsync } from 'purify-ts/EitherAsync'
import { type Either, Left, Right } from 'purify-ts/Either'
import { logger } from '../logger'

export const toEitherAsync = <TError, TValue>(
	callback: (
		right: (value: TValue) => void,
		left: (error: TError) => void,
	) => unknown,
): EitherAsync<TError, TValue> => {
	const promise = new Promise<Either<TError, TValue>>(resolve => {
		const resolveRight = (value: TValue) => {
			resolve(Right(value))
		}
		const rejectLeft = (error: TError) => {
			resolve(Left(error))
		}

		callback(resolveRight, rejectLeft)
	})

	return EitherAsync.fromPromise(() => promise)
}

export const RightAsync = <T>(value: T): EitherAsync<never, T> => {
	return EitherAsync.liftEither(Right(value))
}

export const LeftAsync = <T>(error: T): EitherAsync<T, never> => {
	return EitherAsync.liftEither(Left(error))
}
