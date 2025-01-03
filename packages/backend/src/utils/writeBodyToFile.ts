import { Readable } from 'node:stream'
import fs from 'node:fs'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right, type Either } from 'purify-ts/Either'
import { toEitherAsync } from './eitherAsync'
import { GenericError } from '../lib/GenericError'

const toReadableStream = (body: unknown): Either<GenericError, Readable> => {
	if (!(body instanceof Readable)) {
		return Left(new GenericError('Response body is not a readable stream'))
	}
	return Right(body)
}

const writeToFile = (
	body: Readable,
	outputPath: string,
): EitherAsync<GenericError, void> => {
	return toEitherAsync((resolve, reject) => {
		const writeStream = fs.createWriteStream(outputPath)
		body.pipe(writeStream, { end: true })

		writeStream.on('error', () =>
			reject(
				new GenericError(`Failed to write stream body to file ${outputPath}`),
			),
		)
		writeStream.on('close', () => resolve())
	})
}

export const writeBodyToFile = (
	body: unknown,
	outputPath: string,
): EitherAsync<GenericError, void> => {
	return EitherAsync.liftEither(toReadableStream(body)).chain(async body =>
		writeToFile(body, outputPath),
	)
}
