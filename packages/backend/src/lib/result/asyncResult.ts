import { Result } from './result'

export const asyncResult = <TValue, TError = string>(
	callback: (
		resolve: (value: TValue) => void,
		reject: (error: TError) => void,
	) => void,
): Promise<Result<TValue, TError>> => {
	return new Promise(resolve => {
		const asyncSuccess = (value: TValue) => {
			resolve(Result.success(value))
		}

		const asyncFailure = (error: TError) => {
			resolve(Result.failure(error))
		}

		callback(asyncSuccess, asyncFailure)
	})
}
