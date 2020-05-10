import { IResolvers } from 'graphql-tools';
import { Context } from '../mongodb/context';
import MongoApi from '../datasources/mongo-api';
import { CreateTenantInput } from './types';
import { GoogleUser } from '../google/object';

interface ApolloServerContext {
  dataSources: { mongoApi: MongoApi };
  user: GoogleUser;
}

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
  Mutation: {
    createAdminDatabase: async (_, __, context: ApolloServerContext) => {
      if (!context.user || !Context.isAdmin(context.user)) {
        return null;
      }
      await context.dataSources.mongoApi.createAdminDatabase();
      return true;
    },

    createTenant: async (
      _,
      args: { input: CreateTenantInput },
      context: { dataSources: any }
    ) => {
      console.log(args.input);
      console.log(context);
    },
  },
};

export default resolvers;
