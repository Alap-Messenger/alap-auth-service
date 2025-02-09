import * as dotenv from 'dotenv';
dotenv.config();

const { MONGODB_USERNAME, MONGODB_PASS, DB_NAME, MONGODB_HOST } = process.env;

export default () => ({
  mongoDb: {
    url: `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASS}@${MONGODB_HOST}/${DB_NAME}`,
    username: MONGODB_USERNAME,
    password: MONGODB_PASS,
    host: MONGODB_HOST,
    database: DB_NAME,
  },
});
