const { gql } = require('apollo-server');

const typeDefs = gql`
type Query {
  search: Search 
}
type Search {
  total: Int
  business: [Business]
}
type Business {
  name: String
  coordinates: Coordinates 
}
type Coordinates {
  longitude: Float
  latitude: Float
}
`;

module.exports = typeDefs;