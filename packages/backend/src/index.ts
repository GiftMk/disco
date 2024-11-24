import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "node:fs";

type ServerContext = {};

const typeDefs = readFileSync("./schema.graphql", "utf8");

const server = new ApolloServer<ServerContext>({
  typeDefs,
});

const startServer = async (port: number) => {
  const { url } = await startStandaloneServer(server, {
    listen: { port },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer(4000);
