import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import nodeCleanup from 'node-cleanup'

const filePaths: string[] = []

export const tempFile = (filename: string): string => {
	const filePath = path.join(os.tmpdir(), `${filename}`)
	filePaths.push(filePath)

	return filePath
}

export const cleanupTempFiles = () => {
	for (const filePath of filePaths) {
		if (fs.existsSync(filePath)) {
			fs.rmSync(filePath)
		}
	}
}

nodeCleanup(cleanupTempFiles)
