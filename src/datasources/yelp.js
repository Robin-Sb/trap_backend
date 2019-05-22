import { GraphQLClient } from 'graphql-request'
import { YELP_API_KEY } from '../config';

export class YelpAPI {
  async getPOIs(args) {
    const client = new GraphQLClient('https://api.yelp.com/v3/graphql', {
      headers: {
        Authorization: YELP_API_KEY
      },
    })
      
    var variables = {
      latitude: args.latitude,
      longitude: args.longitude,
      radius: args.radius || undefined,
      limit: args.limit || undefined,
      categories: args.categories || undefined
    };
    console.log(variables);
    if(args.term != null & args.term != undefined) {
      variables.term = args.term;
    }

    var query = `query Query($term: String, $latitude: Float!, $longitude: Float!, $radius: Float, $limit: Int, $categories: String){
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
    const data = await client.request(query, variables);
    return data.search;
  }
}
module.exports = YelpAPI;