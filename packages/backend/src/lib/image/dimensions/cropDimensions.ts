import { Left, Right, type Either } from 'purify-ts/Either'
import type { Dimensions } from './Dimensions'
import { ResizeImageError } from '../ResizeImageError'

const getWidth = (height: number, ratio: number): number => {
	return height * ratio
}

const isEven = (value: number): boolean => {
	return value % 2 === 0
}

export const cropDimensions = (
	dimensions: Dimensions,
	ratio: number,
): Either<ResizeImageError, Dimensions> => {
	const { width, height } = dimensions
	let scaledHeight = height

	while (scaledHeight > 0) {
		const scaledWidth = getWidth(scaledHeight, ratio)

		if (scaledWidth <= width && isEven(scaledWidth) && isEven(scaledHeight)) {
			return Right({ width: scaledWidth, height: scaledHeight })
		}

		scaledHeight--
	}

	return Left(
		new ResizeImageError(
			`Failed to get cropped dimensions for width:${width} and height:${height}`,
		),
	)
}
