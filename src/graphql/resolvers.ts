import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: { getAllTenants: () => [] },
};

export default resolvers;
