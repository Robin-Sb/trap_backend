const models = require( '../models/index');
const { GraphQLScalarType } = require('graphql');

 const resolvers =
{
    Query: {
        yelpPOI: async (_, __, context) =>
        context.yelpAPI.getYelpPOIs(context.variables),

        async customPOI(_, args) {
            return models.CustomPOI.radiusQuery(args.latitude, args.longitude);
    },
}, 
    Mutation: {
        async createPOI (_, {name, description, latitude, longitude}) {
            return await models.CustomPOI.create({
                name,
                description,
                latitude,
                longitude
            })
        }
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