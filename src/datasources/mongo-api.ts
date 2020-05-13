import { DataSource } from 'apollo-datasource';
import { GoogleUser } from '../google/object';
import { Context as MongoContext } from '../mongodb/context';

export default class MongoApi extends DataSource {
  public context!: { user: GoogleUser };

  initialize(config: any) {
    this.context = config.context;
  }

  // #region Public Methods

  public async createAdminDatabase(): Promise<string> {
    return await MongoContext.createAdminDatabase();
  }

  // #endregion Public Methods
}
