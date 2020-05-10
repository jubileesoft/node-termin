import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface ITenantDbSystemTenant {
  _id: mongo.ObjectID;
  name: string;
}

export class TenantDbSystemTenant extends DbBaseDoc {
  public name: string;

  constructor(tenantDbSystemTenant: ITenantDbSystemTenant) {
    super({ _id: tenantDbSystemTenant._id });
    this.__type = DbTypes.tenantDbSystemTenantDoc;

    this.name = tenantDbSystemTenant.name;
  }
}
