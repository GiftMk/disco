export const getPercentageComplete = (
	current: number,
	target: number,
): number => {
	if (!Number.isFinite(current) || !Number.isFinite(target)) return 0

	if (target <= 0 || current <= 0) return 0

	const percentage = Math.ceil((current / target) * 100)

	return Math.min(percentage, 100)
}
