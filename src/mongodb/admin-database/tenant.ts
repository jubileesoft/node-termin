import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface IAdminDbTenant {
  _id: mongo.ObjectID;
  dbName: string;
  name: string;
  adminEmail: string;
}

export class AdminDbTenant extends DbBaseDoc {
  public dbName: string;
  public name: string;
  public adminEmail: string;

  constructor(adminDbTenant: IAdminDbTenant) {
    super({ _id: adminDbTenant._id });
    this.__type = DbTypes.adminDbTenantDoc;

    this.dbName = adminDbTenant.dbName;
    this.name = adminDbTenant.name;
    this.adminEmail = adminDbTenant.adminEmail;
  }
}
