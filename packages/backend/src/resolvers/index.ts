import type { Resolvers } from '../generated/graphql'
import type { ServerContext } from '../serverContext'
import { createVideoResolver } from './createVideoResolver'
import { normaliseAudioResolver } from './normaliseAudioResolver'
import { uploadDetailsResolver } from './uploadDetailsResolver'

export const resolvers: Resolvers<ServerContext> = {
	Query: {
		uploadDetails: uploadDetailsResolver,
		healthcheck: () => 'Healthy and wealthy',
	},
	Mutation: {
		normaliseAudio: normaliseAudioResolver,
		createVideo: createVideoResolver,
	},
}
