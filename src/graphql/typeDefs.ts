const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String
    //adminTenants: [Tenant]
    //agentTenants: [Tenant]
  }

  type TenantConfig {
    id: ID!
    tenantId: String!
    admin: User!
    agents: [User]
  }

  type Tenant {
    id: ID!
    name: String!
    dbName: String!
    config: TenantConfig
  }

  type AdminDatabaseInfo {
    id: ID!
    version: String
    createdAt: String
  }

  input CreateTenantInput {
    name: String
    adminEmail: String
    dbName: String
  }

  type Query {
    getAdminDatabaseInfo: AdminDatabaseInfo
    getAllTenants: [Tenant]
  }

  type Mutation {
    createAdminDatabase: AdminDatabaseInfo
    createTenant(input: CreateTenantInput): Tenant
  }
`;

export default typeDefs;
