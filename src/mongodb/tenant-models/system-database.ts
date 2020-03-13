import mongo from 'mongodb';
import { DbBase, DbTypes } from '../base';

export interface ITenantDbSystemDatabase {
  _id: mongo.ObjectID;
  version: string;
}

export class TenantDbSystemDatabase extends DbBase {
  public version: string;

  constructor(tenantDbSystemDatabase: ITenantDbSystemDatabase) {
    super({ _id: tenantDbSystemDatabase._id });
    this.__type = DbTypes.tenantDbSystemDatabase;

    this.version = tenantDbSystemDatabase.version;
  }
}
