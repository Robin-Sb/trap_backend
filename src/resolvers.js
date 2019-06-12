const models = require( '../models/index');
const { GraphQLScalarType } = require('graphql');

const resolvers =
{
    Query: {
        async yelpPOI (_, args, context) {
            const yelp = await context.yelpAPI.getPOIs(args);
            return yelp.business;
        },
 
        customPOI (_, args) {
            return models.CustomPOI.radiusQuery(args.latitude, args.longitude, args.term).then(
                poi => { return poi }
            );
        },

        async foursquarePOI (_, args, context) {
            const poi = await context.foursquareAPI.getPOIs(args);
            return poi.venues;
        },

        async getPOI (_, args, context) {
            var query = context.query;
            var yelpPOIs = {};
            var yelpBusiness = []
            var foursquarePOIs = {};
            var foursquareVenues = [];
            var customPOIs = [];
            if (query.includes("yelpPOI")) {
                yelpPOIs = await context.yelpAPI.getPOIs(args);
                yelpBusiness = yelpPOIs.business;
                console.log("executed yelp");
            } 

            if (query.includes("foursquarePOI")) {
                foursquarePOIs = await context.foursquareAPI.getPOIs(args);
                foursquareVenues = foursquarePOIs.venues;
                console.log("executed foursquare");
            }

            // if (query.includes("customPOI")) {
            //     customPOIs = await models.CustomPOI.radiusQuery(args.latitude, args.longitude, args.term);
            //     console.log("executed custom");
            // }

            var pois = {};
			console.log(yelpBusiness.length);
            for (var i = 0; i < yelpBusiness.length; i++) {
                for (var j = 0; j < foursquareVenues.length; j++) {
                    var currentYelp = yelpBusiness[i];
                    var currentFS = foursquareVenues[j];
                    var lngDiff = Math.abs(currentYelp.coordinates.longitude - currentFS.location.lng);
                    var latDiff = Math.abs(currentYelp.coordinates.latitude - currentFS.location.lat);
                    if (currentYelp.name.toUpperCase() == currentFS.name.toUpperCase() && latDiff < 0.05 && lngDiff < 0.05) {
                        foursquareVenues.splice(j,1);
                    }
                }
            }

            pois.yelpPOIs = yelpBusiness;
            pois.foursquarePOIs = foursquareVenues;
            // pois.customPOIs = customPOIs;
            return pois;
        }
    },

    CustomPOI: {
        coordinates (obj) {
            return {
                latitude: obj.latitude,
                longitude: obj.longitude
            } 
        }
    },

    FoursquarePOI: {
        coordinates (obj) {
            return {
                latitude: obj.location.lat,
                longitude: obj.location.lng
            }
        }
    },

    POI: {
        yelpPOI (obj) {
            return obj.yelpPOIs;
        },
        foursquarePOI (obj) {
            return obj.foursquarePOIs;
        },
        // customPOI (obj) {
        //     return obj.customPOIs;
        // }
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