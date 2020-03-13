import express from 'express';
import { Context, ICreateTenant } from './mongodb/context';

const app = express();
const port = process.env.PORT || 3000;
app.get('/admin/create/tenant/:id', async (req, res) => {
  const dbName = req.params.id;
  const context = new Context();

  const createTenant: ICreateTenant = {
    dbName,
    admin: {
      email: 'peter.lustig@wdr.de',
      firstName: 'Peter',
      lastName: 'Lustig'
    },
    name: 'Test Mandant'
  };

  const adminPassword = await context.createTenantDatabase(createTenant);
  res.send('Hello world ' + adminPassword);
});

app.get('/admin/delete/tenant/:id', async (req, res) => {
  const dbName = req.params.id;
  const context = new Context();
  await context.dropTenantDatabase({ dbName });
  res.send('Ok');
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
