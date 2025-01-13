import { describe, expect, it } from 'vitest'
import { toGraphQLError } from '../../src/utils/toGraphQLError'
import { Failure } from '../../src/lib/Failure'

describe('toGraphQLError', () => {
	it('includes the error message from the failure', () => {
		const message = 'something went wrong...'
		expect(toGraphQLError(new Failure(message)).message).toBe(message)
	})

	it('includes the type name of Error', () => {
		expect(toGraphQLError(new Failure('fun times')).__typename).toBe('Error')
	})
})
