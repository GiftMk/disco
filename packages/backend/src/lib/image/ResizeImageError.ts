import { ApiError } from '../ApiError'

export class ResizeImageError extends ApiError<'ResizeImageError'> {
	constructor(message: string) {
		super('ResizeImageError', message)
	}
}
