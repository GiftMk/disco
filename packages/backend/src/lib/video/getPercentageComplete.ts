import type { Maybe } from 'purify-ts/Maybe'
import { getSecondsFromTimestamp } from './getSecondsFromTimestamp'

const MAX_PERCENTAGE = 99

export const getPercentageComplete = (
  timestamp: string,
  audioDuration: number,
): Maybe<number> => {
  return getSecondsFromTimestamp(timestamp).map(seconds => {
    const percentage = Math.floor((seconds / audioDuration) * 100)
    return Math.min(percentage, MAX_PERCENTAGE)
  })
}
