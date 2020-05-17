import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface ITenantDbSystemDatabaseDoc {
  _id: mongo.ObjectID;
  version: string;
  createdAt: Date;
}

export class TenantDbSystemDatabaseDoc extends DbBaseDoc {
  public version: string;
  createdAt: Date;

  constructor(doc: ITenantDbSystemDatabaseDoc) {
    super({ _id: doc._id });
    this.__type = DbTypes.tenantDbSystemDatabaseDoc;

    this.version = doc.version;
    this.createdAt = doc.createdAt;
  }
}
