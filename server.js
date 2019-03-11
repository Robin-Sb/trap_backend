require("@babel/register")({})
require("@babel/polyfill");
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');


const PORT = 4000;

const app = express();

const typeDefs = require('./src/schema')

const resolvers = require('./src/resolvers');

const YelpAPI = require('./src/datasources/yelp')

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  dataSources: () => ({
    yelpAPI: new YelpAPI()
  })
});

server.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)