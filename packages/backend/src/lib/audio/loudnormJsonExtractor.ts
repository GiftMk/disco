import { Result } from '../result'

export class LoudnormJsonExtractor {
	private canRead = false
	private lines: string[] = []

	ingest(line: string) {
		if (this.canRead) {
			this.lines.push(line)

			if (line.includes('}')) {
				this.canRead = false
			}
		} else if (line.includes('loudnorm')) {
			this.canRead = true
		}
	}

	reset() {
		this.lines = []
	}

	extract(): Result<Record<string, string>> {
		try {
			const object = JSON.parse(this.lines.join(''))
			return Result.success(object)
		} catch (e) {
			return Result.failure(
				`Failed to locate loudnorm settings from parsed json lines ${this.lines.join('')}`,
			)
		} finally {
			this.reset()
		}
	}
}
