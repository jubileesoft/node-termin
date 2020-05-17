import { DataSource } from 'apollo-datasource';
import { GoogleUser } from '../google/object';
import { Context as MongoContext } from '../mongodb/context';
import { AdminDatabaseInfo } from '../graphql/types';

export default class MongoApi extends DataSource {
  public context!: { user: GoogleUser };

  initialize(config: any) {
    this.context = config.context;
  }

  // #region Public Methods

  public async createAdminDatabase(): Promise<AdminDatabaseInfo | null> {
    return await MongoContext.createAdminDatabase();
  }

  public async getAdminDatabaseInfo(): Promise<AdminDatabaseInfo | undefined> {
    return await MongoContext.getAdminDatabaseInfo();
  }

  // #endregion Public Methods
}
