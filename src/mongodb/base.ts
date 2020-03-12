export enum DbTypes {
  dbBase = 'dbBase',
  tenantDbSystemDatabase = 'tenantDbSystemDatabase',
  tenantDbSystemTenant = 'tenantDbSystemTenant',
  tenantDbUser = 'tenantDbUser'
}

export interface IDbBase {
  _id: any;
}

export class DbBase {
  public _id: any;

  public _type: string = DbTypes.dbBase;

  constructor(dbBase: IDbBase) {
    this._id = dbBase._id;
  }
}
