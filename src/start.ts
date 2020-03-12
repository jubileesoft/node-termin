import express from 'express';
import { Context, ICreateTenant } from './mongodb/context';

const app = express();
const port = process.env.PORT || 3000;
app.get('/create/tenant', async (req, res) => {
  const context = new Context();

  const create: ICreateTenant = {
    dbName: 'test',
    admin: {
      _id: 'pelu',
      email: 'peter.lustig@wdr.de',
      firstName: 'Peter',
      lastName: 'Lustig'
    },
    name: 'Test Mandant'
  };

  const adminPassword = await context.createTenantDatabase(create);
  res.send('Hello world ' + adminPassword);
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
