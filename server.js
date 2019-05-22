require("@babel/register")({})
require("@babel/polyfill");
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const PORT = 4000;

const app = express();

const typeDefs = require('./src/schema')

const resolvers = require('./src/resolvers');

const YelpAPI = require('./src/datasources/yelp')

const FoursquareAPI = require('./src/datasources/foursquare')


// const CustomPOI = require('./src/datasources/custom_poi')

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({req}) => ({
    query: req.body.query,
    variables: req.body.variables,
    yelpAPI: new YelpAPI(),
    foursquareAPI: new FoursquareAPI()
  })
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)