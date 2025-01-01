export class Maybe<T> {
	private readonly _value: T | null

	private constructor(value: T | null) {
		this._value = value
	}

	get hasValue(): boolean {
		return this._value !== null
	}

	get hasNoValue(): boolean {
		return !this.hasValue
	}

	get value(): T {
		if (!this._value) {
			throw new Error('Maybe does not have a value')
		}

		return this._value
	}

	static none<T>(): Maybe<T> {
		return new Maybe<T>(null)
	}

	static from<T>(value?: T | null): Maybe<T> {
		return value ? new Maybe(value) : Maybe.none()
	}
}
