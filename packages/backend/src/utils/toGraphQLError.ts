import type { Failure } from '../lib/Failure'
import type { Error as GraphQLError } from '../generated/graphql'

export const toGraphQLError = (failure: Failure): GraphQLError => {
	return {
		__typename: 'Error',
		message: failure.message,
	}
}
