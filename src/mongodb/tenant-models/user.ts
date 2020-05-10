import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface ITenantDbUser {
  _id: mongo.ObjectID;
  email: string;
  firstName?: string;
  lastName?: string;
  passwordHash: string;
}

export class TenantDbUser extends DbBaseDoc {
  public email: string;
  public firstName: string | undefined;
  public lastName: string | undefined;
  public passwordHash: string;

  constructor(tenantDbUser: ITenantDbUser) {
    super({ _id: tenantDbUser._id });
    this.__type = DbTypes.tenantDbUserDoc;

    this.email = tenantDbUser.email;
    this.firstName = tenantDbUser.firstName;
    this.lastName = tenantDbUser.lastName;
    this.passwordHash = tenantDbUser.passwordHash;
  }
}
