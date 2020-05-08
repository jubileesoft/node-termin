const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Tenant {
    _id: ID
    name: String
    adminEmail: String
    dbName: String
  }

  input CreateTenantInput {
    name: String
    adminEmail: String
    dbName: String
  }

  type Query {
    getAllTenants: [Tenant]
  }

  type Mutation {
    createTenant(input: CreateTenantInput): Tenant
  }
`;

export default typeDefs;
