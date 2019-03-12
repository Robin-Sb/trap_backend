import {GraphQLDataSource} from 'apollo-datasource-graphql';
import {gql} from 'apollo-server-express';
import { GraphQLClient } from 'graphql-request'
import { YELP_API_KEY } from '../config';


const YELP_POI = gql`{
      search(term: "food", latitude: 52.520008, longitude: 13.404954, radius: 10000, limit: 15) {
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
}`;  

export class YelpAPI extends GraphQLDataSource {
    constructor() {
        super();
        this.baseURL = "https://api.yelp.com/v3/graphql";
        this.key = YELP_API_KEY;
    }
    
    async getYelpPOIs() {
        try {
            const response = await this.query(YELP_POI);
            
            return response.data.search;
        } catch (error) {
            console.error(error);
        };
    };

    willSendRequest(request) {
      if (!request.headers) {
        request.headers = {};
      }
      request.headers.authorization = this.key;
    }
};

// export class YelpAPI {
//     async yelpRequest() {
//         const client = new GraphQLClient('https://api.yelp.com/v3/graphql', {
//             headers: {
//               Authorization: YELP_API_KEY
//             },
//           })
          
//         var result;

//         var query = `{
//           business(id: "garaje-san-francisco") {
//               name
//               id
//               rating
//               url
//           }
//         }`
//         const data = await client.request(query);
//         // client.request(query).then(
//         //   data => {
//         //     result = data;
//         //   }
//         // );
//         console.log(data);
//         return data;
//     }
// }

module.exports = YelpAPI;
