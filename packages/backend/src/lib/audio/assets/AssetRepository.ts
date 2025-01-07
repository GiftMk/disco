import type { EitherAsync } from 'purify-ts'
import type { TempFile } from '../../tempFiles/TempFile'
import type { Failure } from '../../Failure'

export interface AssetRepository {
	download(filename: string, outputFile: TempFile): EitherAsync<Failure, void>
	upload(file: TempFile): EitherAsync<Failure, void>
	getUploadUrl(extension: string): EitherAsync<Failure, string>
}
