import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'

export class TempFile {
	readonly rootDir: string
	readonly extension: string
	readonly name: string

	constructor(directory: string, extension: string) {
		this.rootDir = directory
		this.extension = extension
		this.name = `${randomUUID()}.${extension}`
	}

	get path(): string {
		return path.join(this.rootDir, this.name)
	}

	exists(): boolean {
		return fs.existsSync(this.path)
	}
}
