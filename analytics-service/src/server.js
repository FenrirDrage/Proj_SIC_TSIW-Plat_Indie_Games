import dotenv from "dotenv";
dotenv.config();

import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const PORT = process.env.PORT || 4004;

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true
  });

  const { url } = await server.listen({ port: Number(PORT) });
  console.log(`Analytics Service running on ${url}`);
}

start().catch(err => {
  console.error("Error starting server", err);
  process.exit(1);
});
