const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Tenant {
    _id: ID
    name: String
    adminEmail: String
    dbName: String
  }

  type AdminDatabaseInfo {
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
    createAdminDatabase: String
    createTenant(input: CreateTenantInput): Tenant
  }
`;

export default typeDefs;
