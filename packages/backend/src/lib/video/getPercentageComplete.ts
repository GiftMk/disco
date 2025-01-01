import { Maybe, Result } from '../result'
import { getSecondsFromTimestamp } from './getSecondsFromTimestamp'

const MAX_PERCENTAGE = 99

export const getPercentageComplete = (
	timestamp: string,
	audioDuration: number,
): Maybe<number> => {
	const seconds = getSecondsFromTimestamp(timestamp)

	if (!seconds.hasValue) {
		return Maybe.none()
	}

	const percentage = Math.floor((seconds.value / audioDuration) * 100)
	return Maybe.from(Math.min(percentage, MAX_PERCENTAGE))
}
