import { isSuccess, type Result } from '../result'
import { getSecondsFromTimestamp } from './getSecondsFromTimestamp'

export const getPercentageComplete = (
	timestamp: string,
	audioDurationResult: Result<number>,
): number | undefined => {
	const timestampInSecondsResult = getSecondsFromTimestamp(timestamp)
	if (isSuccess(timestampInSecondsResult) && isSuccess(audioDurationResult)) {
		return Math.ceil(
			(timestampInSecondsResult.value / audioDurationResult.value) * 100,
		)
	}
}
