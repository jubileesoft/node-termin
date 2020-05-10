import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface ITenantDbSystemDatabase {
  _id: mongo.ObjectID;
  version: string;
}

export class TenantDbSystemDatabase extends DbBaseDoc {
  public version: string;

  constructor(tenantDbSystemDatabase: ITenantDbSystemDatabase) {
    super({ _id: tenantDbSystemDatabase._id });
    this.__type = DbTypes.tenantDbSystemDatabaseDoc;

    this.version = tenantDbSystemDatabase.version;
  }
}
