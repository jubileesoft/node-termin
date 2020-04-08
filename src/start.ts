import express, { Request, Response } from 'express';
const { ApolloServer } = require('apollo-server-express');

import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typeDefs';

import { Context, ICreateTenant } from './mongodb/context';

const app = express();

// const port = process.env.PORT || 3000;
// app.get('/admin/create/tenant/:id', async (req, res) => {
//   const dbName = req.params.id;
//   const context = new Context();

//   const createTenant: ICreateTenant = {
//     dbName,
//     admin: {
//       email: 'peter.lustig@wdr.de',
//       firstName: 'Peter',
//       lastName: 'Lustig',
//     },
//     name: 'Test Mandant',
//   };

//   const adminPassword = await context.createTenantDatabase(createTenant);
//   res.send('Hello world ' + adminPassword);
// });

// app.get('/admin/delete/tenant/:id', async (req, res) => {
//   const dbName = req.params.id;
//   const context = new Context();
//   await context.dropTenantDatabase({ dbName });
//   res.send('Ok');
// });

// app.get('/tenant/:id/users', async (req, res) => {
//   //
// });

const server = new ApolloServer({
  playground: true,
  typeDefs,
  resolvers,
  context: async (req: Request, res: Response) => {
    console.log(req);
    return null;
  },
});

server.applyMiddleware({ app });

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
