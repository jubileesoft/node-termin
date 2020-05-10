import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface IAdminDbSystemDatabaseDoc {
  _id: mongo.ObjectID;
  version: string;
  createdAt: Date;
}

export class AdminDbSystemDatabaseDoc extends DbBaseDoc {
  public version: string;
  public createdAt: Date;

  constructor(doc: IAdminDbSystemDatabaseDoc) {
    super({ _id: doc._id });
    this.__type = DbTypes.adminDbSystemDatabaseDoc;

    this.version = doc.version;
    this.createdAt = doc.createdAt;
  }
}
