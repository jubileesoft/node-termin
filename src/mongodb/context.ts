import { MongoDBConfig, IMongoDBConfig } from './config';
import mongo from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { TenantDbSystemTenant } from './tenant-models/system-tenant';
import {
  TenantDbSystemDatabaseDoc,
  ITenantDbSystemDatabaseDoc,
} from './tenant-models/system-database-doc';
import { TenantDbUser } from './tenant-models/user';
import {
  AdminDbTenantDoc,
  IAdminDbTenantDoc,
} from './admin-database/tenant-doc';
import { GoogleUser } from 'src/google/object';
import { AdminDbSystemDatabaseDoc } from './admin-database/system-database-doc';
import { DbTypes } from './base';
import {
  AdminDatabaseInfo,
  TenantDatabaseInfo,
  CreateTenantInput,
  TenantFull,
} from 'src/graphql/types';
import { IAdminDbUserDoc, AdminDbUserDoc } from './admin-database/user-doc';
import { IAdminDbTenantConfigDoc } from './admin-database/tenant-config-doc';

export interface IDropTenant {
  dbName: string;
}

export class Context {
  // #region Fields

  private static config: IMongoDBConfig = MongoDBConfig;

  private static adminDb: string = 'appo';
  private static adminDbVersions: string[] = ['1.0'];

  private static tenantDbSuffix: string = 'appo_';
  private static tenantDbVersions: string[] = ['1.0'];

  // #endregion Fields

  // #region Properties

  // #endregion Properties

  // #region Constructor

  constructor() {
    // this.initMigration();
  }

  // #endregion Constructor

  // #region Public Methods

  public static async getAdminDatabaseInfo(): Promise<
    AdminDatabaseInfo | undefined
  > {
    let client: mongo.MongoClient | undefined;
    try {
      client = await this.getClient();
      const adminDb = client.db(this.adminDb);

      const doc: AdminDbSystemDatabaseDoc | null = await adminDb
        .collection('system')
        .findOne({ __type: DbTypes.adminDbSystemDatabaseDoc });

      if (!doc) {
        return undefined;
      }

      const adminDatabaseInfo: AdminDatabaseInfo = {
        id: doc._id.toString(),
        version: doc.version,
        createdAt: new Date(doc.createdAt).toISOString(),
      };
      client.close();
      return adminDatabaseInfo;
    } catch (error) {
      client?.close();
      throw error;
    }
  }

  public static async createAdminDatabase(): Promise<AdminDatabaseInfo | null> {
    let client: mongo.MongoClient | undefined;

    try {
      client = await this.getClient();
      const adminDb = client.db(this.adminDb);

      // Check if a database already exists
      let doc: AdminDbSystemDatabaseDoc | null = await adminDb
        .collection('system')
        .findOne({ __type: DbTypes.adminDbSystemDatabaseDoc });

      if (doc) {
        client.close();
        return null;
      }

      // The admin database does not exist. Continue.
      for (const version of this.adminDbVersions) {
        const ignored = await this.migrateAdminDatabaseTo(adminDb, version);
        // For now ignore the result
      }

      doc = await adminDb
        .collection('system')
        .findOne({ __type: DbTypes.adminDbSystemDatabaseDoc });

      client.close();

      if (!doc) {
        return null;
      }

      const adminDatabaseInfo: AdminDatabaseInfo = {
        id: doc._id.toString(),
        version: doc.version,
        createdAt: new Date(doc.createdAt).toISOString(),
      };
      return adminDatabaseInfo;
    } catch (error) {
      client?.close();
      throw error;
    }
  }

  private static async migrateAdminDatabaseTo(
    adminDb: mongo.Db,
    version: string
  ): Promise<void> {
    if (!this.adminDbVersions.includes(version)) {
      return;
    }

    switch (version) {
      case '1.0':
        // 1.0 STEP 1: Create collection "system" with database document
        const adminDbSystemDatabase = new AdminDbSystemDatabaseDoc({
          _id: new mongo.ObjectID(),
          version,
          createdAt: new Date(),
        });
        const systemCollection = adminDb.collection('system');
        await systemCollection.insertOne(adminDbSystemDatabase);
        break;
    }
  }

  public static async createTenant(
    input: CreateTenantInput
  ): Promise<TenantFull | null> {
    let client: mongo.MongoClient | undefined;
    let tenantDb: mongo.Db | undefined;
    let adminDb: mongo.Db | undefined;
    try {
      client = await this.getClient();
      adminDb = client.db(this.adminDb);
      tenantDb = client.db(this.tenantDbSuffix + input.short);

      let doc: ITenantDbSystemDatabaseDoc | null = await tenantDb
        .collection('system')
        .findOne({ __type: DbTypes.tenantDbSystemDatabaseDoc });

      if (doc) {
        client.close();
        return null;
      }

      // The tenant database does not exist. Continue.
      for (const version of this.tenantDbVersions) {
        const ignored = await this.migrateTenantDatabaseTo(tenantDb, version);
        // For now ignore the result
      }

      // Create or get user
      let userDoc: IAdminDbUserDoc | null = await tenantDb
        .collection('users')
        .findOne({
          email: input.adminEmail.toLowerCase(),
          __type: DbTypes.tenantDbUserDoc,
        });
      if (!userDoc) {
        // Create user
        userDoc = new AdminDbUserDoc({
          _id: new mongo.ObjectID(),
          email: input.adminEmail.toLowerCase(),
        });
        const usersCollection = adminDb.collection('users');
        await usersCollection.insertOne(userDoc);
      }

      // Create tenant entry in admin database
      const tenantDoc = new AdminDbTenantDoc({
        _id: new mongo.ObjectID(),
        name: input.name,
        short: input.short,
      });
      const tenantsCollection = adminDb.collection('tenants');
      await tenantsCollection.insertOne(tenantDoc);

      // Create tenantConfig entry in admin database
      const tenantConfigDoc: IAdminDbTenantConfigDoc = {
        _id: new mongo.ObjectID(),
        tenant_id: tenantDoc._id,
        admin_id: userDoc._id,
        agent_ids: [],
      };

      const gqlTenant: TenantFull = {
        id: tenantDoc._id.toString(),
        name: tenantDoc.name,
        short: tenantDoc.short,
        config: {
          id: tenantConfigDoc._id.toHexString(),
          admin: {
            id: userDoc._id.toString(),
            email: userDoc.email,
          },
          agents: [],
        },
      };

      return gqlTenant;
    } catch (error) {
      throw error;
    } finally {
      client?.close();
    }
  }

  private static async migrateTenantDatabaseTo(
    tenantDb: mongo.Db,
    version: string
  ): Promise<void> {
    if (!this.tenantDbVersions.includes(version)) {
      return;
    }
    switch (version) {
      case '1.0':
        // 1.0 STEP 1: Create collection "system" with database doc
        const tenantDbSystemDatabaseDoc = new TenantDbSystemDatabaseDoc({
          _id: new mongo.ObjectID(),
          version,
          createdAt: new Date(),
        });
        const systemCollection = tenantDb.collection('system');
        await systemCollection.insertOne(tenantDbSystemDatabaseDoc);
        break;
    }
  }

  public static async getAllTenants() {
    const client = await this.getClient();

    const adminDb = client.db(this.adminDb);
    const tenantsCollection = adminDb.collection('tenants');

    const returnArray: IAdminDbTenantDoc[] = await tenantsCollection
      .find({})
      .toArray();

    client.close();

    return returnArray;
  }

  public static async isAdmin(user: GoogleUser) {
    return user.email.toLowerCase() === 'ellerbrock.christian@gmail.com';
  }

  // public static async createTenantDatabase(
  //   createTenant: ICreateTenant
  // ): Promise<string> {
  //   let client: mongo.MongoClient | undefined;
  //   let tenantDb: mongo.Db | undefined;
  //   let adminDb: mongo.Db | undefined;
  //   try {
  //     if (
  //       createTenant.dbVersion &&
  //       !this.versions.includes(createTenant.dbVersion)
  //     ) {
  //       const e = {
  //         message: `The provided version ${createTenant.dbVersion} does not exist. Available are:\n`,
  //       };
  //       e.message += this.versions.join(',');
  //       throw e;
  //     }

  //     client = await mongo.MongoClient.connect(this.config.url, {
  //       useUnifiedTopology: true,
  //     });
  //     tenantDb = client.db(this.tenantDbSuffix + createTenant.dbName);

  //     let adminPassword: string = '';

  //     for (const version of this.versions) {
  //       const result = await this.migrateTenantDatabaseTo(
  //         tenantDb,
  //         version,
  //         createTenant
  //       );

  //       if (version === '1.0') {
  //         // result is the admin password (string)
  //         adminPassword = result;
  //       }

  //       if (version === createTenant.dbVersion) {
  //         break; // stop migrating once the desired version is achived
  //       }
  //     }

  //     // Add newly created tenant to the admin database
  //     adminDb = client.db(this.adminDb);
  //     await this.addTenantToAdminDatabase(adminDb, createTenant);

  //     client.close();
  //     return adminPassword;
  //   } catch (e) {
  //     client?.close();
  //     console.error(e.message);
  //     throw e;
  //   }
  // }

  // public static async dropTenantDatabase(dropTenant: IDropTenant) {
  //   let client: mongo.MongoClient | undefined;
  //   let tenantDb: mongo.Db | undefined;
  //   let adminDb: mongo.Db | undefined;

  //   try {
  //     client = await mongo.MongoClient.connect(this.config.url, {
  //       useUnifiedTopology: true,
  //     });
  //     tenantDb = client.db(this.tenantDbSuffix + dropTenant.dbName);
  //     await tenantDb.dropDatabase();

  //     adminDb = client.db(this.adminDb);
  //     const tenantsCollection = adminDb.collection('tenants');

  //     await tenantsCollection.deleteOne({
  //       dbName: dropTenant.dbName,
  //     });

  //     client.close();
  //   } catch (e) {
  //     client?.close();
  //     console.error(e.message);
  //     throw e;
  //   }
  // }

  // #endregion Public Methods

  // #region Private Methods

  private static async getClient() {
    return mongo.MongoClient.connect(this.config.url, {
      useUnifiedTopology: true,
    });
  }

  // private static async migrateTenantDatabaseTo(
  //   db: mongo.Db,
  //   version: string,
  //   createTenant: ICreateTenant
  // ): Promise<any> {
  //   if (!this.versions.includes(version)) {
  //     return;
  //   }

  //   switch (version) {
  //     case '1.0':
  //       // 1.0 STEP 1: Create collection "system" with two documents
  //       const systemCollection = db.collection('system');
  //       const dbSystemDatabase = new TenantDbSystemDatabase({
  //         _id: new mongo.ObjectID(),
  //         version,
  //       });
  //       const dbSystemTenant = new TenantDbSystemTenant({
  //         _id: new mongo.ObjectID(),
  //         name: createTenant.name,
  //       });
  //       await systemCollection.insertMany([dbSystemDatabase, dbSystemTenant]);

  //       // 1.0 STEP 2: Create collection "users"

  //       const adminPassword = uuidv4(); // generate random password
  //       const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  //       const usersCollection = db.collection('users');
  //       const dbUser = new TenantDbUser({
  //         _id: new mongo.ObjectID(),
  //         email: createTenant.admin.email,
  //         firstName: createTenant.admin.firstName,
  //         lastName: createTenant.admin.lastName,
  //         passwordHash: adminPasswordHash,
  //       });
  //       await usersCollection.insertOne(dbUser);

  //       // 1.0 Step 3: Return adminPassword
  //       return adminPassword;

  //     default:
  //       break;
  //   }
  // }

  // private static async addTenantToAdminDatabase(
  //   db: mongo.Db,
  //   createTenant: ICreateTenant
  // ): Promise<void> {
  //   const tenantsCollection = db.collection('tenants');
  //   const adminDbTenant = new AdminDbTenant({
  //     _id: new mongo.ObjectID(),
  //     dbName: createTenant.dbName,
  //     name: createTenant.name,
  //   });
  //   await tenantsCollection.insertOne(adminDbTenant);
  // }

  // #endregion Private Methods
}
