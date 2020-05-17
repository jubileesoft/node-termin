import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface IAdminDbTenantDoc {
  _id: mongo.ObjectID;
  name: string;
  short: string;
}

export class AdminDbTenantDoc extends DbBaseDoc {
  public name: string;
  public short: string;

  constructor(doc: IAdminDbTenantDoc) {
    super({ _id: doc._id });
    this.__type = DbTypes.adminDbTenantDoc;

    this.name = doc.name;
    this.short = doc.short;
  }
}
