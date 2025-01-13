import type { Resolvers } from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { createVideoResolver } from './createVideoResolver'
import { creatingVideoResolver } from './creatingVideoResolver'
import { uploadDetailsResolver } from './uploadDetailsResolver'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		uploadDetails: uploadDetailsResolver,
		ping: () => 'pong',
	},
	Mutation: {
		createVideo: createVideoResolver,
	},
	Subscription: {
		creatingVideo: creatingVideoResolver(),
	},
}
