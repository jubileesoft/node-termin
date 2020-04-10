import express, { Request, Response } from 'express';
const { ApolloServer } = require('apollo-server-express');
import fetch from 'node-fetch';

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(
  '472845354613-qhjjmmug094kpv9b4iu35g65aa34v4u0.apps.googleusercontent.com'
);

async function verify(token: string) {
  const url =
    'https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + token;

  const response = await fetch(url, {
    method: 'GET',
    compress: false,
    headers: {
      Accept: 'application/json',
    },
  });
  console.log(response.url);
  console.log(response.body);
  if (response.status !== 200) {
    return null;
  }
  let aDS = await response.buffer();
  //let asd = await response.text();
  let sd = await response.json();
  return 3;
}

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

// https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=ya29.a0Ae4lvC1024L7RRZWnALwKOCMu3DCpqgbMiyowmHTS8ee3LJtnXtCk0aV04D2i40F8y6j2WA1oU8DuR2H2msbDqxtig38pE-FD52fYA-_NGa_yylcwC_ODgkutqrG8NJpy0UgASdT59Ekm0SFakwP9ouSeK5NQFNDUUE
// app.use('/graphql', (req, res, next) => {
//   passport.authenticate('google-verifiy-token', (err, user, info) => {
//     next();
//   });
// });

const server = new ApolloServer({
  playground: true,
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const notAuthenticated = { user: null };
    try {
      if (typeof req.headers.authorization !== 'string') {
        return notAuthenticated;
      }

      const token = req.headers.authorization.split(' ')[1];
      const user = await verify(token);
      return { user };
    } catch (e) {
      return notAuthenticated;
    }
  },
});

server.applyMiddleware({ app });

// Start the server
app.listen(3000, () => {
  console.log('Go to http://localhost:3000/graphiql to run queries!');
});
