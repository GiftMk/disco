import fs from 'node:fs'
import path from 'node:path'
import { logger } from '../../logger'
import { TempFile } from './TempFile'
import { Mutex } from 'async-mutex'

export class TempDirectory implements Disposable {
	private readonly directory: string
	private readonly mutex: Mutex

	constructor(rootDirectory: string) {
		try {
			this.directory = fs.mkdtempSync(`${rootDirectory}${path.sep}`)
			this.mutex = new Mutex()
		} catch (e) {
			logger.error(e instanceof Error ? e.message : String(e))
			throw new Error(
				`Failed to create temp directory in root directory '${rootDirectory}'`,
			)
		}
	}

	newFile(extension: string): TempFile {
		return new TempFile(this.directory, extension)
	}

	async lock() {
		await this.mutex.acquire()
	}

	async unlock() {
		this.mutex.release()
	}

	[Symbol.dispose]() {
		this.mutex.acquire().then(release => {
			fs.rmSync(this.directory, { recursive: true, force: true })
			release()
		})
	}
}
