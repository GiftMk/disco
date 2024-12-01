import type { AudioVideoFilter } from 'fluent-ffmpeg'

type CropProps = {
	width: number
	height: number
	x?: number
	y?: number
}

export const crop = ({
	width,
	height,
	x = width / 2,
	y = height / 2,
}: CropProps): AudioVideoFilter => ({
	filter: 'crop',
	options: `${width}:${height}:${x}:${y}`,
})
