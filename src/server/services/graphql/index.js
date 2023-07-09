import { ApolloServer } from "@apollo/server";
import Resolvers from "./resolvers";
import Schema from "./schema";

const executableSchema = new ApolloServer({
  typeDefs: Schema,
  resolvers: Resolvers,
});

const server = new ApolloServer({
  schema: executableSchema,
  context: ({ req }) => req,
});

export default server;
