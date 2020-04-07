import express from 'express';
import bodyParser from 'body-parser';
const { ApolloServer } = require('apollo-server-express');
import { applyMiddleware } from 'graphql-middleware';
import middleware from './middleware'; // returns array of middelware

import schema from './data/schema';

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

const schemaWithMiddleware = applyMiddleware(schema, ...middleware);

const server = new ApolloServer({
  playground: true,
  //typeDefs: schema,
  //resolvers,
  context: async ({ req, res }) => ({ req, res }), // now we can access express objects from apollo context arg
  schema: schemaWithMiddleware, // add this property
});

//const server = new ApolloServer({ schema });

const path = '/graphql';
app.use(path);

server.applyMiddleware({ app });

// The GraphQL endpoint
// app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

// // GraphiQL, a visual editor for queries
// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
