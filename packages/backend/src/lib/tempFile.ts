import path from 'node:path'
import os from 'node:os'

export const tempFile = (filename: string): string => {
	return path.join(os.tmpdir(), `${filename}`)
}
