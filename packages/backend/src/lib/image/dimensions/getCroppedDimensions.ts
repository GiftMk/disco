import type { Dimensions } from './Dimensions'
import { failure, type Result, success } from '../../result'

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
			return success({ width: scaledWidth, height: scaledHeight })
		}

		scaledHeight--
	}

	return failure(`Failed to crop dimensions ${width}x${height}`)
}
