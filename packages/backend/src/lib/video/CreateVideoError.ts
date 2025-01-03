import { ApiError } from '../ApiError'

export class CreateVideoError extends ApiError<'CreateVideoError'> {
	constructor(message: string) {
		super('CreateVideoError', message)
	}
}
