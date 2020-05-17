export interface CreateTenantInput {
  name: string;
  short: string;
  adminEmail: string;
}

export interface AdminDatabaseInfo {
  id: string;
  version: string;
  createdAt: string;
}

export interface TenantDatabaseInfo {
  id: string;
  version: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
}

export interface TenantFull {
  id: string;
  name: string;
  short: string;
  config: {
    id: string;
    admin: User;
    agents: User[];
  };
}

export interface TenantConfig {
  id: string;
}
