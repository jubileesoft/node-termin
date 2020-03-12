import { DbBase, DbTypes } from '../base';

export interface ITenantDbSystemDatabase {
  _id: any;
  version: string;
}

export class TenantDbSystemDatabase extends DbBase {
  public version: string;

  constructor(tenantDbSystemDatabase: ITenantDbSystemDatabase) {
    super({ _id: tenantDbSystemDatabase._id });
    this._type = DbTypes.tenantDbSystemDatabase;

    this.version = tenantDbSystemDatabase.version;
  }
}
