import * as dotenv from 'dotenv';
dotenv.config();

const { REDIS_PORT, REDIS_HOST } = process.env;

export default () => ({
  redis: {
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
    port: parseInt(REDIS_PORT, 10),
    host: REDIS_HOST,
  },
});
