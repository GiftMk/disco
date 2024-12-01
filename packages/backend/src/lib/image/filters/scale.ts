import type { AudioVideoFilter } from 'fluent-ffmpeg'

type SizeProps = {
	width: number
	height: number
}

export const scale = ({ width, height }: SizeProps): AudioVideoFilter => ({
	filter: 'scale',
	options: `${width}:${height}`,
})
