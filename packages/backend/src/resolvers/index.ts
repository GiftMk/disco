import type { Resolvers } from "../generated/graphql";
import type { ServerContext } from "../serverContext";
import { normaliseAudioResolver } from "./normaliseAudioResolver";
import { uploadDetailsResolver } from "./uploadDetailsResolver";

export const resolvers: Resolvers<ServerContext> = {
  Query: {
    uploadDetails: uploadDetailsResolver,
  },
  Mutation: {
    normaliseAudio: normaliseAudioResolver,
  },
};
