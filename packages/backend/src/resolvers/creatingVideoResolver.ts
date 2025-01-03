import type {
	CreatingVideoResponse,
	SubscriptionCreatingVideoArgs,
} from '../generated/graphql'
import type { ServerContext } from '../serverContext'

export const creatingVideoResolver = () => ({
	subscribe: (
		_: unknown,
		{ trackingId }: SubscriptionCreatingVideoArgs,
		{ pubSub }: ServerContext,
	) => pubSub.subscribe('creatingVideo', trackingId),
	resolve: (payload: CreatingVideoResponse) => payload,
})
