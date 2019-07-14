const { gql } = require('apollo-server');

const typeDefs = gql`
scalar DateTime

type Query {
  getPOI(latitude: Float!, longitude: Float!, term: String, radius: Int, limit: Int, yelpCategories: String, foursquareCategories: String): POI
  yelpPOI (latitude: Float!, longitude: Float!, term: String, radius: Int, limit: Int, categories: String): [YelpPOI] 
  customPOI (latitude: Float!, longitude: Float!, term: String!, category: String): [CustomPOI]
  foursquarePOI (latitude: Float!, longitude: Float!, term: String, categories: String): [FoursquarePOI]
  getAmount(latitude: Float!, longitude: Float!, radius: Int, yelpCategories: String, foursquareCategories: String): Amount
}

type POI {
  yelpPOI: [YelpPOI]
  customPOI: [CustomPOI]
  foursquarePOI: [FoursquarePOI]
}

type YelpPOI {
  id: String
  name: String
  url: String
  rating: Float
  coordinates: Coordinates 
}

type FoursquarePOI {
  id: String
  name: String
  url: String
  coordinates: Coordinates 
}

type Amount {
  yelpAmount: Int
  foursquareAmount: Int
  customAmount: Int
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
  id: Int
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
        tags: [String]
    ): CustomPOI

    addTag (
        name: String!
    ): Tag
}
`;

module.exports = typeDefs;
