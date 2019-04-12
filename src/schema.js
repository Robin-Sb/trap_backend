const { gql } = require('apollo-server');

const typeDefs = gql`
scalar DateTime

type Query {
  yelpPOI: Yelp 
  customPOI (latitude: Float!, longitude: Float!): [CustomPOI]
}

type Yelp {
  total: Int
  business: [Business]
}

type Business {
  name: String
  coordinates: Coordinates 
}

type Coordinates {
  latitude: Float
  longitude: Float
}

type CustomPOI {
  name: String
  description: String
  latitude: Float
  longitude: Float
  createdAt: DateTime
  updatedAt: DateTime
}

type Mutation {
    createPOI (
        name: String!,
        description: String,
        latitude: Float!
        longitude: Float!
    ): CustomPOI

}
`;

module.exports = typeDefs;