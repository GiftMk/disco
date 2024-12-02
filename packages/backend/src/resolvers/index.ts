import type { Resolvers } from '../generated/graphql'
import { pubsub } from '../pubsub'
import type { ServerContext } from '../serverContext'
import { createVideoResolver } from './createVideoResolver'
import { normaliseAudioResolver } from './normaliseAudioResolver'
import { uploadDetailsResolver } from './uploadDetailsResolver'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		uploadDetails: uploadDetailsResolver,
	},
	Mutation: {
		normaliseAudio: normaliseAudioResolver,
		createVideo: createVideoResolver,
	},
	Subscription: {
		creatingVideo: {
			subscribe: () => pubsub.subscribe('CREATING_VIDEO'),
		},
	},
}
