import { asyncResult, Result } from '../../lib/result'
import { Readable } from 'node:stream'
import fs from 'node:fs'

export const writeBodyToFile = async (
	body: unknown | undefined,
	outputPath: string,
): Promise<Result> => {
	if (!(body instanceof Readable)) {
		return Result.failure('Response body is not a readable stream')
	}

	return asyncResult((resolve, reject) => {
		const writeStream = fs.createWriteStream(outputPath)
		body.pipe(writeStream, { end: true })

		writeStream.on('error', e =>
			reject(`Failed to write stream body to file ${outputPath}`),
		)
		writeStream.on('close', () => resolve())
	})
}
