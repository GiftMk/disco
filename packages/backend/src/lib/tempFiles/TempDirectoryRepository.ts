import { TempDirectory } from './TempDirectory'

export class TempDirectoryRepository {
	private readonly rootDirectory: string

	constructor(rootDirectory: string) {
		this.rootDirectory = rootDirectory
	}

	newDirectory(): TempDirectory {
		return new TempDirectory(this.rootDirectory)
	}
}
