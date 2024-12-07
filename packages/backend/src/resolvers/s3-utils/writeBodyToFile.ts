import { type Result, emptySuccess, failure } from '../../lib/result'
import { Readable } from 'node:stream'
import fs from 'node:fs'

export const writeBodyToFile = async (
	body: unknown | undefined,
	outputPath: string,
): Promise<Result> => {
	if (!(body instanceof Readable)) {
		return failure('Response body is not a readable stream')
	}

	return new Promise<Result>((resolve, reject) => {
		const writeStream = fs.createWriteStream(outputPath)
		body.pipe(writeStream, { end: true })

		writeStream.on('error', e => reject(e.message))
		writeStream.on('close', () => resolve(emptySuccess()))
	})
}
