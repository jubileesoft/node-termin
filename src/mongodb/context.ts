import { MongoDBConfig, IMongoDBConfig } from './config';
import mongo from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { TenantDbSystemTenant } from './tenant-models/system-tenant';
import { TenantDbSystemDatabase } from './tenant-models/system-database';
import { TenantDbUser } from './tenant-models/user';

export interface ICreateTenantUser {
  _id: string;
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

  public async createTenantDatabase(create: ICreateTenant): Promise<string> {
    let client: mongo.MongoClient | undefined;
    let db: mongo.Db | undefined;
    try {
      if (create.dbVersion && !this.versions.includes(create.dbVersion)) {
        const e = {
          message: `The provided version ${create.dbVersion} does not exist. Available are:\n`
        };
        e.message += this.versions.join(',');
        throw e;
      }

      client = await mongo.MongoClient.connect(this.config.url, {
        useUnifiedTopology: true
      });
      db = client.db(this.tenantDbSuffix + create.dbName);

      let adminPassword: string = '';

      for (const version of this.versions) {
        const result = await this.migrateTenantDatabaseTo(db, version, create);

        if (version === '1.0') {
          // result is the admin password (string)
          adminPassword = result;
        }

        if (version === create.dbVersion) {
          break; // stop migrating once the desired version is achived
        }
      }
      client.close();
      return adminPassword;
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
    create: ICreateTenant
  ): Promise<any> {
    if (!this.versions.includes(version)) {
      return;
    }

    switch (version) {
      case '1.0':
        // 1.0 STEP 1: Create collection "system" with two documents
        const systemCollection = await db.createCollection('system');
        const dbSystemDatabase = new TenantDbSystemDatabase({
          _id: 'database',
          version
        });
        const dbSystemTenant = new TenantDbSystemTenant({
          _id: 'tenant',
          name: create.name
        });
        await systemCollection.insertMany([dbSystemDatabase, dbSystemTenant]);

        // 1.0 STEP 2: Create collection "users"

        const adminPassword = uuidv4(); // generate random password
        const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

        const usersCollection = await db.createCollection('users');
        const dbUser = new TenantDbUser({
          _id: create.admin._id,
          email: create.admin.email,
          firstName: create.admin.firstName,
          lastName: create.admin.lastName,
          passwordHash: adminPasswordHash
        });
        await usersCollection.insertOne(dbUser);

        // 1.0 Step 3: Return adminPassword
        return adminPassword;

      default:
        break;
    }
  }

  // #endregion Private Methods
}
