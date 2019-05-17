import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { env } = process;


module.exports = {
    YELP_API_KEY: env.YELP_API_KEY,
    FOURSQUARE_ID: env.FOURSQUARE_ID,
    FOURSQUARE_SECRET: env.FOURSQUARE_SECRET
}
// export const YELP_API_KEY = env.YELP_API_KEY;
// export const FOURSQUARE_ID = env.FOURSQUARE_ID;
// export const FOURSQUARE_SECRET = env.FOURSQUARE_SECRET;