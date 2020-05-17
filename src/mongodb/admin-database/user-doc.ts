import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface IAdminDbUserDoc {
  _id: mongo.ObjectID;
  email: string;
}

export class AdminDbUserDoc extends DbBaseDoc {
  public email: string;

  constructor(doc: IAdminDbUserDoc) {
    super({ _id: doc._id });
    this.__type = DbTypes.adminDbTenantDoc;

    this.email = doc.email;
  }
}
