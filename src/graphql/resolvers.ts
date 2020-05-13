import { IResolvers } from 'graphql-tools';
import { Context } from '../mongodb/context';
import MongoApi from '../datasources/mongo-api';
import { CreateTenantInput } from './types';
import { GoogleUser } from '../google/object';
import { AuthenticationError, ApolloError } from 'apollo-server-express';

interface ApolloServerContext {
  dataSources: { mongoApi: MongoApi };
  user: GoogleUser;
}

const ensureIsAuthenticated = (context: ApolloServerContext) => {
  if (!context.user) {
    throw new AuthenticationError('Unauthenticated.');
  }
};

const ensureIsAdmin = (context: ApolloServerContext) => {
  if (!Context.isAdmin(context.user)) {
    throw new ApolloError('Insufficient rights.', 'NOADMIN', undefined);
  }
};

const resolvers: IResolvers = {
  Query: {
    getAdminDatabaseInfo: async (_, __, context: ApolloServerContext, ___) => {
      ensureIsAuthenticated(context);
      ensureIsAdmin(context);

      return await context.dataSources.mongoApi.getAdminDatabaseInfo();
    },

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
      ensureIsAuthenticated(context);
      ensureIsAdmin(context);

      return await context.dataSources.mongoApi.createAdminDatabase();
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
