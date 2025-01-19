import ffmpeg from 'fluent-ffmpeg'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import { expect } from 'vitest'

const getSHA256 = (filePath: string, outputFile: string): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		ffmpeg(filePath)
			.inputOption('-loglevel error')
			.outputOption('-f hash')
			.on('end', () => resolve())
			.on('error', reject)
			.saveToFile(outputFile)
	})
}

export const expectFilesAreEqual = async (
	a: string,
	b: string,
): Promise<void> => {
	const pathToHashA = `${randomUUID()}.sha256`
	const pathToHashB = `${randomUUID()}.sha256`

	try {
		await getSHA256(a, pathToHashA)
		await getSHA256(b, pathToHashB)

		const hashA = fs.readFileSync(pathToHashA, 'utf-8')
		const hashB = fs.readFileSync(pathToHashB, 'utf-8')

		expect(hashA).toBe(hashB)
	} finally {
		fs.rmSync(pathToHashA)
		fs.rmSync(pathToHashB)
	}
}
