import path from 'node:path'

export const pathToSampleFile = (filename: string): string => {
	return path.join(import.meta.dirname, filename)
}
