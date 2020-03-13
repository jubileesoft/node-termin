import mongo from 'mongodb';
import { DbBase, DbTypes } from '../base';

export interface ITenantDbSystemTenant {
  _id: mongo.ObjectID;
  name: string;
}

export class TenantDbSystemTenant extends DbBase {
  public name: string;

  constructor(tenantDbSystemTenant: ITenantDbSystemTenant) {
    super({ _id: tenantDbSystemTenant._id });
    this.__type = DbTypes.tenantDbSystemTenant;

    this.name = tenantDbSystemTenant.name;
  }
}
