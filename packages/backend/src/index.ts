import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";
import { getServerContext, type ServerContext } from "./serverContext";
import { resolvers } from "./resolvers";
import { logger } from "./lib/logger";

const typeDefs = readFileSync("./schema.graphql", "utf8");

const server = new ApolloServer<ServerContext>({
  typeDefs,
  resolvers,
});

const startServer = async (port: number) => {
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: getServerContext,
  });

  logger.info(`🚀  Server ready at: ${url}`);
};

startServer(8080);
