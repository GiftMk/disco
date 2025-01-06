import { EitherAsync } from 'purify-ts/EitherAsync'
import { type Either, Left, Right } from 'purify-ts/Either'

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

type AsyncAction<TError, TValue> = {
	run: EitherAsync<TError, TValue>
	predicate?: () => boolean
}

export const concurrently = <TError, TValue>(
	...actions: AsyncAction<TError, TValue>[]
) => {
	const runnables: EitherAsync<TError, TValue>[] = []

	for (const action of actions) {
		if (action.predicate) {
			action.predicate() && runnables.push(action.run)
		} else {
			runnables.push(action.run)
		}
	}

	return EitherAsync.all(runnables)
}
