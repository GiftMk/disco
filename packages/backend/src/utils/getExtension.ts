import path from 'node:path'

export const getExtension = (filePath: string): string => {
	const extension = path.parse(filePath).ext

	return extension.replace('.', '')
}
