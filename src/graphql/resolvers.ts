import { IResolvers } from 'graphql-tools';

const resolvers: IResolvers = {
  Query: {
    getAllTenants: (parent, args, context, info) => {
      console.log(context.user);
      return [];
    },
  },
};

export default resolvers;
