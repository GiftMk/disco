import type { ApiError } from '../lib/ApiError'

export const toGraphQLError = <T extends string>(e: ApiError<T>) => ({
	__typename: e.type,
	message: e.message,
})
