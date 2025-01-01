import { Maybe } from './maybe'

export class Result<TValue = void, TError = string> {
	private readonly _value: Maybe<TValue>
	private readonly _error: Maybe<TError>

	private constructor(value: Maybe<TValue>, error: Maybe<TError>) {
		this._value = value
		this._error = error
	}

	get value(): TValue {
		if (!this._value.hasValue) {
			throw new Error('Result does not contain a value')
		}

		return this._value.value
	}

	get error(): TError {
		if (!this._error.hasValue) {
			throw new Error('Result does not contain an error')
		}

		return this._error.value
	}

	get isSuccess(): boolean {
		return !this._error.hasValue
	}

	get isFailure(): boolean {
		return !this.isSuccess
	}

	static success<TValue, TError>(value: TValue): Result<TValue, TError>

	static success<TError>(): Result<void, TError>

	static success<TValue, TError>(value?: TValue): Result<TValue, TError> {
		return new Result(Maybe.from(value), Maybe.none())
	}

	static failure<TValue, TError>(error: TError): Result<TValue, TError> {
		return new Result(Maybe.none(), Maybe.from(error))
	}
}
