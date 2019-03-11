import {GraphQLDataSource} from 'apollo-datasource-graphql';
import {gql} from 'apollo-server-express';
import { GraphQLClient } from 'graphql-request'

const YELP_POI = gql`{
      search(term: "burrito", location: "san francisco", limit: 5) {
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
    // baseURL = 'https://api.yelp.com/v3/graphql';
    constructor() {
        super();
        this.baseURL = "https://api.yelp.com/v3/graphql";
        this.key =  "Bearer FfLMJXvs0iVD5I5K8x5BHaz7dWbv64WzwSDOw0I_HkqNlc4aTaoUvd2KyFPAMi_Mhrqi-ABmzJbXhh-Tu44eqmeAuNwEZ6uJtDf5IyEaNlQkT_-dLnu5bwZK3_aAXHYx";
    }
    
    async getYelpPOIs() {
        try {
            const response = await this.query(YELP_POI);
            console.log(response.data);
            
            return response.data.search;
        } catch (error) {
            console.error(error);
        };
    };

    willSendRequest(request) {
        const { accessToken } = this.key;    
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
//               Authorization: "Bearer FfLMJXvs0iVD5I5K8x5BHaz7dWbv64WzwSDOw0I_HkqNlc4aTaoUvd2KyFPAMi_Mhrqi-ABmzJbXhh-Tu44eqmeAuNwEZ6uJtDf5IyEaNlQkT_-dLnu5bwZK3_aAXHYx",
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
