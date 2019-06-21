import { GraphQLClient } from 'graphql-request'
import { YELP_API_KEY } from '../config';

export class YelpAPI {
  async getPOIs(args, type) {
    const client = new GraphQLClient('https://api.yelp.com/v3/graphql', {
      headers: {
        Authorization: YELP_API_KEY
      },
    })
      
    var variables = {
      latitude: args.latitude,
      longitude: args.longitude,
      radius: args.radius || undefined,
      categories: args.yelpCategories || undefined
    };

    if (args.term != null & args.term != undefined) {
      variables.term = args.term;
    }

    if (args.yelpCategories != undefined || args.yelpCategories != null) {
        variables.categories = args.yelpCategories;
    }

    var query;
    if (type == "search") {
      variables.limit = args.limit || undefined;
      query = `query Query($term: String, $latitude: Float!, $longitude: Float!, $radius: Float, $limit: Int, $categories: String){
        search(term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit, categories: $categories) {
          total
          business {
            name
            id
            rating
            url
            coordinates {
              latitude
              longitude
            }
          }
        }
      }`
    }
    if (type == "amount") {
      query = `query Query($latitude: Float!, $longitude: Float!, $radius: Float, $categories: String) {
        search(latitude: $latitude, longitude: $longitude, radius: $radius, categories: $categories) {
          total
        }
      }`
    }
    const data = await client.request(query, variables);
    return data.search;
  }
}
module.exports = YelpAPI;