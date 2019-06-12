const { RESTDataSource } = require('apollo-datasource-rest');
import { FOURSQUARE_ID, FOURSQUARE_SECRET } from '../config';


class FoursquareAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = 'https://api.foursquare.com/v2/venues/';
      this.initialize({});
    }
  
    willSendRequest(request) {
        request.params.set('client_id', FOURSQUARE_ID);
        request.params.set('client_secret', FOURSQUARE_SECRET);
        request.params.set('v', 20190425);
    }
  
    async getPOIs(args) {
      const query = {
        ll: args.latitude + "," + args.longitude,
        intent: "checkin",
        radius: 40000,
        limit: 15,
      }

      if (args.term != undefined || args.term != null) {
        query.query = args.term;
      }

      if (args.foursquareCategories != undefined || args.foursquareCategories != null) {
        query.categoryId = args.foursquareCategories;
      }

      const data = await this.get('search', query);
      return data.response;
    }
}
module.exports = FoursquareAPI;
