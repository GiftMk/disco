import { failure, success, type Result } from '../result'

export class LoudnormJsonExtractor {
	private canRead = false
	private lines: string[] = []

	consume(line: string) {
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

	extract(): Result<{
		[key: string]: string
	}> {
		try {
			const object = JSON.parse(this.lines.join(''))
			return success(object)
		} catch (e) {
			return failure(
				`Locating loudnorm settings from parsed json lines ${this.lines.join('')}`,
				e,
			)
		} finally {
			this.reset()
		}
	}
}
