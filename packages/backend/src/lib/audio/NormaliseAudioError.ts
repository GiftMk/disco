import { ApiError } from '../ApiError'

export class NormaliseAudioError extends ApiError<'NormaliseAudioError'> {
	constructor(message: string) {
		super('NormaliseAudioError', message)
	}
}
