import { Readable } from 'node:stream'
import fs from 'node:fs'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right, type Either } from 'purify-ts/Either'
import { toEitherAsync } from '../../utils/eitherAsync'

const toReadableStream = (body: unknown): Either<string, Readable> => {
	if (!(body instanceof Readable)) {
		return Left('Response body is not a readable stream')
	}
	return Right(body)
}

const writeToFile = (
	body: Readable,
	outputPath: string,
): EitherAsync<string, void> => {
	return toEitherAsync((resolve, reject) => {
		const writeStream = fs.createWriteStream(outputPath)
		body.pipe(writeStream, { end: true })

		writeStream.on('error', e =>
			reject(`Failed to write stream body to file ${outputPath}`),
		)
		writeStream.on('close', () => resolve())
	})
}

export const writeBodyToFile = (
	body: unknown,
	outputPath: string,
): EitherAsync<string, void> => {
	return EitherAsync.liftEither(toReadableStream(body)).chain(async body =>
		writeToFile(body, outputPath),
	)
}
