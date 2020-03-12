import { DbBase, DbTypes } from '../base';

export interface ITenantDbSystemTenant {
  _id: any;
  name: string;
}

export class TenantDbSystemTenant extends DbBase {
  public name: string;

  constructor(tenantDbSystemTenant: ITenantDbSystemTenant) {
    super({ _id: tenantDbSystemTenant._id });
    this._type = DbTypes.tenantDbSystemTenant;

    this.name = tenantDbSystemTenant.name;
  }
}
