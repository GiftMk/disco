import { ApiError } from './ApiError'

export class GenericError extends ApiError<'GenericError'> {
	constructor(message: string) {
		super('GenericError', message)
		this.message = message
	}
}
