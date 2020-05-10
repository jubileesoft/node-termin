import mongo from 'mongodb';

export enum DbTypes {
  dbBaseDoc = 'dbBaseDoc',
  adminDbTenantDoc = 'adminDbTenantDoc',
  adminDbSystemDatabaseDoc = 'tenantDbSystemDatabaseDoc',

  tenantDbSystemDatabaseDoc = 'tenantDbSystemDatabaseDoc',
  tenantDbSystemTenantDoc = 'tenantDbSystemTenantDoc',
  tenantDbUserDoc = 'tenantDbUserDoc',
}

export interface IDbBaseDoc {
  _id: mongo.ObjectID;
}

export class DbBaseDoc {
  public _id: mongo.ObjectID;

  public __type: string = DbTypes.dbBaseDoc;

  constructor(dbBase: IDbBaseDoc) {
    this._id = dbBase._id;
  }
}
