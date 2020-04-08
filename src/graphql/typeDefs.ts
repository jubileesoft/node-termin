const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Tenant {
    _id: ID
    dbName: String
    name: String
  }
  type Query {
    getAllTenants: [Tenant]
  }
`;

export default typeDefs;
