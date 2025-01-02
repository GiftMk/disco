import { EitherAsync } from 'purify-ts/EitherAsync'
import { type Either, Left, Right } from 'purify-ts/Either'

export const toEitherAsync = <TError, TValue>(
	callback: (
		resolve: (value: TValue) => void,
		reject: (error: TError) => void,
	) => unknown,
): EitherAsync<TError, TValue> => {
	const promise = new Promise<Either<TError, TValue>>((resolve, reject) => {
		const resolveRight = (value: TValue) => {
			resolve(Right(value))
		}
		const rejectLeft = (error: TError) => {
			reject(Left(error))
		}

		callback(resolveRight, rejectLeft)
	})

	return EitherAsync.fromPromise(() => promise)
}
