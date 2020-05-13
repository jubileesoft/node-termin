export interface CreateTenantInput {
  name: string;
  adminEmail: string;
  dbName: string;
}

export interface AdminDatabaseInfo {
  version: string;
  createdAt: string;
}
