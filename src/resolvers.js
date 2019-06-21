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
            if (args.category == null) {
                return models.CustomPOI.radiusQuery(args.latitude, args.longitude, args.term).then(
                    poi => { return poi }
                );    
            } else {
                return models.CustomPOI.radiusQueryWithCategory(args.latitude, args.longitude, args.term, args.category).then(
                    poi => { return poi }
                );
            }
        },

        async foursquarePOI (_, args, context) {
            const poi = await context.foursquareAPI.getPOIs(args);
            return poi.venues;
        },

        async getPOI (_, args, context) {
            var query = context.query;
            var yelpPOIs = {};
            var yelpBusiness = [];
            var foursquarePOIs = {};
            var foursquareVenues = [];
            var customPOIs = [];
            try {
                if (query.includes("yelpPOI")) {
                    yelpPOIs = await context.yelpAPI.getPOIs(args, "search");
                    yelpBusiness = yelpPOIs.business;
                } 
            } catch (exception) {
                console.log(exception);
            }

            try {
                if (query.includes("foursquarePOI")) {
                    foursquarePOIs = await context.foursquareAPI.getPOIs(args);
                    foursquareVenues = foursquarePOIs.venues;
                }
            } catch (exception) {
                console.log(exception);
            }
            try {
                if (query.includes("customPOI")) {				
                    customPOIs = await models.CustomPOI.radiusQuery(args);
                }
            } catch (exception) {
                console.log(exception);
            }

            var pois = {};
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
            pois.customPOIs = customPOIs;
            return pois;
        },
        async getAmount (_, args, context) {
			var query = context.query;
            var yelpAmount = {};
            var foursquareAmount = {};
            var customAmount = {};
            try {
                if (query.includes("yelpAmount")) {
                    var yelpResponse = await context.yelpAPI.getPOIs(args, "amount");
                    yelpAmount = yelpResponse.total;
                }
            } catch (exception) {
                console.log(exception);
            }
            try {
                if (query.includes("foursquareAmount")) {
                    var foursquareResponse = await context.foursquareAPI.getPOIs(args, "amount");
                    foursquareAmount = foursquareResponse.venues.length;
                }
            } catch (exception) {
                console.log(exception);
            }
            try {
                if (query.includes("customAmount")) {
                    var customResponse = await models.CustomPOI.radiusQuery(args);
                    customAmount = customResponse.length;
                }            
            } catch (exception) {
                console.log(exception);
            }

            return {
                yelpAmount: yelpAmount,
                foursquareAmount: foursquareAmount,
                customAmount: customAmount
            }
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
        customPOI (obj) {
            return obj.customPOIs;
        }
    },

    Amount: {
        yelpAmount (obj) {
            return obj.yelpAmount
        },
        foursquareAmount (obj) {
            return obj.foursquareAmount
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

            var tagIds = [];
            for (var i = 0; i < tags.length; i++) {
                var tag = await models.Tag.findOne({where: {name: tags[i]}})
                tagIds.push(tag.id);
            }
            await poi.setTags(tagIds);
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

async function getTagIdByName(tags) {
    for (var i = 0; i < tags.length; i++) {
        console.log("tag " + tags[i]);
        models.Tag.findOne( {where: {name: tags[i]}} ).then(response => {
            console.log("Response: " + response)
            tagIds.push(response.id);
            console.log("tagId1: " + tagIds[0]);
        });
    }
}

module.exports = resolvers;