import type { Resolvers } from "../generated/graphql";
import type { ServerContext } from "../serverContext";
import { uploadDetails } from "./uploadDetails";

export const resolvers: Resolvers<ServerContext> = {
  Query: {
    uploadDetails,
  },
};
