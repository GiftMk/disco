import { failure, success, type Result } from '../result'

export const getSecondsFromTimestamp = (timestamp: string): Result<number> => {
	const sections = timestamp.split(':')
	const hours = Number(sections[0])
	const minutes = Number(sections[1])
	const seconds = Number(sections[2])

	if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
		return failure(`Failed to parse timestamp ${timestamp}`)
	}

	return success(hours * 60 * 60 + minutes * 60 + seconds)
}
