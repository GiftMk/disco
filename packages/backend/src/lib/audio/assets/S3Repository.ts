import { type Either, Left, Right } from 'purify-ts/Either'
import { EitherAsync } from 'purify-ts/EitherAsync'
import { GenericError } from '../../GenericError'
import type { AssetRepository } from './AssetRepository'
import {
	GetObjectCommand,
	PutObjectCommand,
	type GetObjectCommandOutput,
	type S3Client,
} from '@aws-sdk/client-s3'
import { toEitherAsync } from '../../../utils/eitherAsync'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'node:fs'
import { logger } from '../../../logger'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { TempFile } from '../../tempFiles/TempFile'
import { Readable } from 'node:stream'

const URL_TIMEOUT_S = 60 * 15

export class S3Repository implements AssetRepository {
	private readonly s3Client: S3Client
	private readonly inputBucket: string
	private readonly outputBucket: string

	constructor(s3Client: S3Client, inputBucket: string, outputBucket: string) {
		this.s3Client = s3Client
		this.inputBucket = inputBucket
		this.outputBucket = outputBucket
	}

	download(
		filename: string,
		outputFile: TempFile,
	): EitherAsync<GenericError, void> {
		return toEitherAsync<GenericError, GetObjectCommandOutput>(
			async (resolve, reject) => {
				try {
					const response = await this.s3Client.send(
						new GetObjectCommand({ Bucket: this.inputBucket, Key: filename }),
					)

					if (response) {
						resolve(response)
					} else {
						reject(
							new GenericError(
								`No response was returned when downloading '${filename}' from S3 bucket '${this.inputBucket}'`,
							),
						)
					}
				} catch {
					reject(
						new GenericError(
							`Failed to download key '${filename}' from S3 bucket '${this.inputBucket}'`,
						),
					)
				}
			},
		).chain(response =>
			S3Repository.writeBodyToFile(response.Body, outputFile.path),
		)
	}

	upload(asset: TempFile): EitherAsync<GenericError, void> {
		return toEitherAsync(async (resolve, reject) => {
			try {
				const uploadToS3 = new Upload({
					client: this.s3Client,
					params: {
						Bucket: this.outputBucket,
						Key: asset.name,
						Body: fs.createReadStream(asset.path),
					},
				})

				uploadToS3.on('httpUploadProgress', ({ loaded, total }) =>
					logger.info(
						`Uploading ${asset.name} to S3 bucket ${this.outputBucket}, uploaded ${loaded}/${total} bytes`,
					),
				)

				await uploadToS3.done()

				logger.info(
					`Finished uploading ${asset.name} to S3 bucket ${this.outputBucket}`,
				)
				resolve()
			} catch {
				reject(
					new GenericError(
						`Failed to upload key ${asset.path} to S3 bucket ${this.outputBucket}`,
					),
				)
			}
		})
	}

	getUploadUrl(filename: string): EitherAsync<GenericError, string> {
		const command = new PutObjectCommand({
			Bucket: this.inputBucket,
			Key: filename,
		})

		return toEitherAsync(async (resolve, reject) => {
			try {
				const url = await getSignedUrl(this.s3Client, command, {
					expiresIn: URL_TIMEOUT_S,
				})
				resolve(url)
			} catch {
				reject(
					new GenericError(
						`Failed to get signed url for key ${filename} in bucket ${this.inputBucket}`,
					),
				)
			}
		})
	}

	private static toReadableStream(
		body: unknown,
	): Either<GenericError, Readable> {
		if (!(body instanceof Readable)) {
			return Left(new GenericError('Response body is not a readable stream'))
		}
		return Right(body)
	}

	private static writeToFile(
		body: Readable,
		outputPath: string,
	): EitherAsync<GenericError, void> {
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

	private static writeBodyToFile(
		body: unknown,
		outputPath: string,
	): EitherAsync<GenericError, void> {
		return EitherAsync.liftEither(S3Repository.toReadableStream(body)).chain(
			async body => S3Repository.writeToFile(body, outputPath),
		)
	}
}
