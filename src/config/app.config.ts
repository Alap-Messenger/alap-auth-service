import * as dotenv from 'dotenv';
dotenv.config();

const { PORT, NODE_ENV } = process.env;

export default () => ({
  port: parseInt(PORT, 10),
  env: NODE_ENV,
});
