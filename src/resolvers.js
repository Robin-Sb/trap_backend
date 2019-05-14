const models = require( '../models/index');
const { GraphQLScalarType } = require('graphql');

const { CustomPOI } = require('../models');

const resolvers =
{
    Query: {
        async yelpPOI (_, __, context) {
            const yelp = await context.yelpAPI.getYelpPOIs(context.variables);
            return yelp.business;
        },

        customPOI (_, args) {
            return models.CustomPOI.radiusQuery(args.latitude, args.longitude, args.term).then(
                poi => { return poi }
            );
        },
    },

    CustomPOI: {
        coordinates (obj) {
            return {
                latitude: obj.latitude,
                longitude: obj.longitude
            } 
        }
    },
     
    Mutation: {
        async createPOI (_, {name, description, latitude, longitude, tags}) {
            const poi = await models.CustomPOI.create({
                name,
                description,
                latitude,
                longitude
            });

            await poi.setTags(tags);

            return poi;
        },
        async addTag(_, {name}) {
            return await models.Tag.create({
                name,
            });
        },
    
    },
    DateTime: new GraphQLScalarType({

        name: 'DateTime',

        description: 'DateTime type',

        parseValue(value) {

            // value from the client

            return new Date(value);

        },

        serialize(value) {

            const date = new Date(value);

            // value sent to the client

            return date.toISOString();

        },

        parseLiteral(ast) {

            if (ast.kind === Kind.INT) {

                // ast value is always in string format

                return parseInt(ast.value, 10);

            }

            return null;

        }
    })
};

module.exports = resolvers;