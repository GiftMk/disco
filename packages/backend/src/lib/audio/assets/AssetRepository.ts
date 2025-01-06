import type { EitherAsync } from 'purify-ts'
import type { GenericError } from '../../GenericError'
import type { TempFile } from '../../tempFiles/TempFile'

export interface AssetRepository {
	download(
		filename: string,
		outputFile: TempFile,
	): EitherAsync<GenericError, void>
	upload(file: TempFile): EitherAsync<GenericError, void>
	getUploadUrl(extension: string): EitherAsync<GenericError, string>
}
