import type { Resolvers } from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { createVideoResolver } from './createVideoResolver'
import { creatingVideoResolver } from './creatingVideoResolver'
import { presignedUrlResolver } from './presignedUrlResolver'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		presignedUrl: presignedUrlResolver,
	},
	Mutation: {
		createVideo: createVideoResolver,
	},
	Subscription: {
		creatingVideo: creatingVideoResolver(),
	},
}
