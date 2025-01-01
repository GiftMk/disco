import { Maybe } from '../result'

export const getSecondsFromTimestamp = (timestamp: string): Maybe<number> => {
	const sections = timestamp.split(':')
	const hours = Number(sections[0])
	const minutes = Number(sections[1])
	const seconds = Number(sections[2])

	if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
		return Maybe.none()
	}

	return Maybe.from(hours * 60 * 60 + minutes * 60 + seconds)
}
