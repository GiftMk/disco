export abstract class ApiError<T extends string = string> {
	type: Readonly<T>
	message: Readonly<string>

	constructor(type: T, message: string) {
		this.type = type
		this.message = message
	}

	toString(): string {
		return JSON.stringify({ type: this.type, message: this.message })
	}
}
