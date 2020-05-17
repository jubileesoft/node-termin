export interface CreateTenantInput {
  name: string;
  adminEmail: string;
  dbName: string;
}

export interface AdminDatabaseInfo {
  id: string;
  version: string;
  createdAt: string;
}
