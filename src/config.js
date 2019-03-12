import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const { env } = process;

export const YELP_API_KEY = env.YELP_API_KEY;