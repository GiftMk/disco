import type { EitherAsync } from 'purify-ts'
import { Failure } from '../../Failure'
import type { AssetRepository } from './AssetRepository'
import fs from 'node:fs'
import path from 'node:path'
import { LeftAsync, RightAsync } from '../../../utils/eitherAsync'
import { logger } from '../../../logger'
import type { TempFile } from '../../tempFiles/TempFile'

export class FileSystemRepository implements AssetRepository {
	private readonly inputDirectory: string
	private readonly outputDirectory: string

	constructor(inputDirectory: string, outputDirectory: string) {
		this.inputDirectory = inputDirectory
		this.outputDirectory = outputDirectory
	}

	download(filename: string, outputFile: TempFile): EitherAsync<Failure, void> {
		const inputPath = path.join(this.inputDirectory, filename)

		if (!fs.existsSync(inputPath)) {
			return LeftAsync(
				new Failure(
					`Asset ${filename} does not exist in local directory ${this.inputDirectory}`,
				),
			)
		}
		try {
			logger.info(`Copying file at ${inputPath} to ${outputFile.path}`)
			fs.copyFileSync(inputPath, outputFile.path)

			return RightAsync(undefined)
		} catch (e) {
			logger.error(e instanceof Error ? e.message : String(e))

			return LeftAsync(
				new Failure(
					`Failed to copy file at ${inputPath} to ${outputFile.path}`,
				),
			)
		}
	}

	upload(asset: TempFile): EitherAsync<Failure, void> {
		if (!asset.exists()) {
			return LeftAsync(new Failure(`Asset at ${asset.path} does not exist`))
		}
		const outputPath = path.join(this.outputDirectory, asset.name)

		try {
			logger.info(`Uploading file at ${asset.path} to ${outputPath}`)

			fs.copyFileSync(asset.path, outputPath)
			return RightAsync(undefined)
		} catch (e) {
			logger.error(e instanceof Error ? e.message : String(e))

			return LeftAsync(
				new Failure(`Failed to copy file at ${asset.path} to ${outputPath}`),
			)
		}
	}

	getUploadUrl(filename: string): EitherAsync<Failure, string> {
		throw new Error('Method not implemented.')
	}
}
