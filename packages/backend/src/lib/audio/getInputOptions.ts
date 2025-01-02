import type { NormalisationSettings } from './NormalisationSettings'

export const getInputOptions = (settings: NormalisationSettings): string[] => [
  `I=${settings.integrated}`,
  `TP=${settings.truePeak}`,
  `LRA=${settings.loudnessRange}`,
]
