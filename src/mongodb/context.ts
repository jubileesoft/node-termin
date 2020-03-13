import { MongoDBConfig, IMongoDBConfig } from './config';
import mongo from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { TenantDbSystemTenant } from './tenant-models/system-tenant';
import { TenantDbSystemDatabase } from './tenant-models/system-database';
import { TenantDbUser } from './tenant-models/user';
import { AdminDbTenant, IAdminDbTenant } from './admin-models/tenant';

export interface ICreateTenantUser {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ICreateTenant {
  dbName: string;
  dbVersion?: string;
  admin: ICreateTenantUser;
  name: string;
}

export interface IDropTenant {
  dbName: string;
}

export class Context {
  // #region Properties

  // #endregion Properties

  // #region Fields

  private config: IMongoDBConfig = MongoDBConfig;
  private versions: string[] = ['1.0'];
  private tenantDbSuffix: string = 'appo_';
  private adminDb: string = 'appo';

  // #endregion Fields

  // #region Constructor

  constructor() {
    // this.initMigration();
  }

  // #endregion Constructor

  // #region Public Methods

  public async createTenantDatabase(
    createTenant: ICreateTenant
  ): Promise<string> {
    let client: mongo.MongoClient | undefined;
    let tenantDb: mongo.Db | undefined;
    let adminDb: mongo.Db | undefined;
    try {
      if (
        createTenant.dbVersion &&
        !this.versions.includes(createTenant.dbVersion)
      ) {
        const e = {
          message: `The provided version ${createTenant.dbVersion} does not exist. Available are:\n`
        };
        e.message += this.versions.join(',');
        throw e;
      }

      client = await mongo.MongoClient.connect(this.config.url, {
        useUnifiedTopology: true
      });
      tenantDb = client.db(this.tenantDbSuffix + createTenant.dbName);

      let adminPassword: string = '';

      for (const version of this.versions) {
        const result = await this.migrateTenantDatabaseTo(
          tenantDb,
          version,
          createTenant
        );

        if (version === '1.0') {
          // result is the admin password (string)
          adminPassword = result;
        }

        if (version === createTenant.dbVersion) {
          break; // stop migrating once the desired version is achived
        }
      }

      // Add newly created tenant to the admin database
      adminDb = client.db(this.adminDb);
      await this.addTenantToAdminDatabase(adminDb, createTenant);

      client.close();
      return adminPassword;
    } catch (e) {
      client?.close();
      console.error(e.message);
      throw e;
    }
  }

  public async dropTenantDatabase(dropTenant: IDropTenant) {
    let client: mongo.MongoClient | undefined;
    let tenantDb: mongo.Db | undefined;
    let adminDb: mongo.Db | undefined;

    try {
      client = await mongo.MongoClient.connect(this.config.url, {
        useUnifiedTopology: true
      });
      tenantDb = client.db(this.tenantDbSuffix + dropTenant.dbName);
      await tenantDb.dropDatabase();

      adminDb = client.db(this.adminDb);
      const tenantsCollection = adminDb.collection('tenants');

      await tenantsCollection.deleteOne({
        dbName: dropTenant.dbName
      });

      client.close();
    } catch (e) {
      client?.close();
      console.error(e.message);
      throw e;
    }
  }

  // #endregion Public Methods

  // #region Private Methods

  private async migrateTenantDatabaseTo(
    db: mongo.Db,
    version: string,
    createTenant: ICreateTenant
  ): Promise<any> {
    if (!this.versions.includes(version)) {
      return;
    }

    switch (version) {
      case '1.0':
        // 1.0 STEP 1: Create collection "system" with two documents
        const systemCollection = db.collection('system');
        const dbSystemDatabase = new TenantDbSystemDatabase({
          _id: new mongo.ObjectID(),
          version
        });
        const dbSystemTenant = new TenantDbSystemTenant({
          _id: new mongo.ObjectID(),
          name: createTenant.name
        });
        await systemCollection.insertMany([dbSystemDatabase, dbSystemTenant]);

        // 1.0 STEP 2: Create collection "users"

        const adminPassword = uuidv4(); // generate random password
        const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

        const usersCollection = db.collection('users');
        const dbUser = new TenantDbUser({
          _id: new mongo.ObjectID(),
          email: createTenant.admin.email,
          firstName: createTenant.admin.firstName,
          lastName: createTenant.admin.lastName,
          passwordHash: adminPasswordHash
        });
        await usersCollection.insertOne(dbUser);

        // 1.0 Step 3: Return adminPassword
        return adminPassword;

      default:
        break;
    }
  }

  private async addTenantToAdminDatabase(
    db: mongo.Db,
    createTenant: ICreateTenant
  ): Promise<void> {
    const tenantsCollection = db.collection('tenants');
    const adminDbTenant = new AdminDbTenant({
      _id: new mongo.ObjectID(),
      dbName: createTenant.dbName,
      name: createTenant.name
    });
    await tenantsCollection.insertOne(adminDbTenant);
  }

  // #endregion Private Methods
}
