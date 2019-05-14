const { gql } = require('apollo-server');

const typeDefs = gql`
scalar DateTime

type Query {
  yelpPOI: [Business] 
  customPOI (latitude: Float!, longitude: Float!, term: String!): [CustomPOI]
}

type Yelp {
  total: Int
  business: [Business]
}

type Business {
  id: String
  name: String
  rating: String
  url: String
  coordinates: Coordinates 
}

type Coordinates {
  latitude: Float
  longitude: Float
}

type CustomPOI {
  name: String
  description: String
  coordinates: Coordinates
  createdAt: DateTime
  updatedAt: DateTime
  tags: [Tag]
}

type Tag {
    name: String
    id: Int
}

type Mutation {
    createPOI (
        name: String!,
        description: String,
        latitude: Float!
        longitude: Float!
        tags: [Int]
    ): CustomPOI

    addTag (
        name: String!
    ): Tag
}
`;

module.exports = typeDefs;