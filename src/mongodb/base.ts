import mongo from 'mongodb';

export enum DbTypes {
  dbBase = 'dbBase',
  adminDbTenant = 'adminDbTenant',
  tenantDbSystemDatabase = 'tenantDbSystemDatabase',
  tenantDbSystemTenant = 'tenantDbSystemTenant',
  tenantDbUser = 'tenantDbUser'
}

export interface IDbBase {
  _id: mongo.ObjectID;
}

export class DbBase {
  public _id: mongo.ObjectID;

  public __type: string = DbTypes.dbBase;

  constructor(dbBase: IDbBase) {
    this._id = dbBase._id;
  }
}
