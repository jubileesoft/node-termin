import { IResolvers } from 'graphql-tools';
import { Context } from '../mongodb/context';

const resolvers: IResolvers = {
  Query: {
    getAllTenants: async (parent, args, context, info) => {
      if (!context.user || !Context.isAdmin(context.user)) {
        return null;
      }

      return await Context.getAllTenants();
      return [];
    },
  },
};

export default resolvers;
