import mongo from 'mongodb';
import { DbBaseDoc, DbTypes } from '../base';

export interface IAdminDbTenantConfigDoc {
  _id: mongo.ObjectID;
  tenant_id: mongo.ObjectID;
  admin_id: mongo.ObjectID;
  agent_ids: mongo.ObjectID[];
}

export class AdminDbTenantConfigDoc extends DbBaseDoc {
  public tenant_id: mongo.ObjectID;
  public admin_id: mongo.ObjectID;
  public agent_ids: mongo.ObjectID[];

  constructor(doc: IAdminDbTenantConfigDoc) {
    super({ _id: doc._id });
    this.__type = DbTypes.adminDbTenantDoc;

    this.tenant_id = doc.tenant_id;
    this.admin_id = doc.admin_id;
    this.agent_ids = doc.agent_ids;
  }
}
