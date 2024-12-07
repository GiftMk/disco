import { isSuccess, type Result } from '../result'
import { getSecondsFromTimestamp } from './getSecondsFromTimestamp'

const MAX_PERCENTAGE = 99

export const getPercentageComplete = (
	timestamp: string,
	audioDurationResult: Result<number>,
): number | undefined => {
	const timestampInSecondsResult = getSecondsFromTimestamp(timestamp)
	if (isSuccess(timestampInSecondsResult) && isSuccess(audioDurationResult)) {
		const percentage = Math.floor(
			(timestampInSecondsResult.value / audioDurationResult.value) * 100,
		)

		return Math.min(percentage, MAX_PERCENTAGE)
	}
}
