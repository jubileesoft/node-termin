import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { IResolvers } from 'graphql-tools';
//import mocks from './mocks';

const typeDefs = `
  type Tenant { _id: ID, dbName: String, name: String }
  type Query { getTenants: [Tenant] }
`;

const resolvers: IResolvers = {
  Query: { getTenants: () => [] },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

//addMockFunctionsToSchema({ schema, mocks });

export default schema;
