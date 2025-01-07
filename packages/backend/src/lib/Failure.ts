export class Failure {
	message: Readonly<string>

	constructor(message: string) {
		this.message = message
	}

	toString(): string {
		return JSON.stringify({ message: this.message })
	}
}
