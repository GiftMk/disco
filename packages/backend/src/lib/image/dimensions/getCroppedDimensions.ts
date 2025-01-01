import type { Dimensions } from './Dimensions'
import { Result } from '../../result'

const getWidth = (height: number, ratio: number): number => {
	return height * ratio
}

const isEven = (value: number): boolean => {
	return value % 2 === 0
}

export const getCroppedDimensions = (
	dimensions: Dimensions,
	ratio: number,
): Result<Dimensions> => {
	const { width, height } = dimensions
	let scaledHeight = height

	while (scaledHeight > 0) {
		const scaledWidth = getWidth(scaledHeight, ratio)

		if (scaledWidth <= width && isEven(scaledWidth) && isEven(scaledHeight)) {
			return Result.success({ width: scaledWidth, height: scaledHeight })
		}

		scaledHeight--
	}

	return Result.failure(
		`Failed to get cropped dimensions for width:${width} and height:${height}`,
	)
}
