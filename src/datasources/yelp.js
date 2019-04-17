import { GraphQLClient } from 'graphql-request'
import { YELP_API_KEY } from '../config';


export class YelpAPI {
  async getYelpPOIs(args) {
    console.log(args)
    const client = new GraphQLClient('https://api.yelp.com/v3/graphql', {
      headers: {
        Authorization: YELP_API_KEY
      },
    })
      
    var variables = {
      term: args.term,
      latitude: args.latitude,
      longitude: args.longitude,
      radius: args.radius,
      limit: args.limit,
    };

    var query = `query Query($term: String!, $latitude: Float!, $longitude: Float!, $radius: Float!, $limit: Int!){
      search(term: $term, latitude: $latitude, longitude: $longitude, radius: $radius, limit: $limit) {
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