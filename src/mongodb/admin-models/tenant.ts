import mongo from 'mongodb';
import { DbBase, DbTypes } from '../base';

export interface IAdminDbTenant {
  _id: mongo.ObjectID;
  dbName: string;
  name: string;
}

export class AdminDbTenant extends DbBase {
  public dbName: string;
  public name: string;

  constructor(adminDbTenant: IAdminDbTenant) {
    super({ _id: adminDbTenant._id });
    this.__type = DbTypes.adminDbTenant;

    this.dbName = adminDbTenant.dbName;
    this.name = adminDbTenant.name;
  }
}
