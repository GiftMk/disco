import type { EitherAsync } from 'purify-ts'
import type { TempFile } from '../tempFiles/TempFile'
import type { Failure } from '../Failure'

export type OnUploadProgress = (percentageComplete: number) => void

export interface AssetRepository {
	download(filename: string, outputFile: TempFile): EitherAsync<Failure, void>
	upload(
		file: TempFile,
		onProgress?: OnUploadProgress,
	): EitherAsync<Failure, void>
	getUploadUrl(extension: string): EitherAsync<Failure, string>
}
