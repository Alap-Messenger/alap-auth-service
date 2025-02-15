import * as dotenv from 'dotenv';
dotenv.config();

const {
  PORT,
  NODE_ENV,
  PUBLIC_SITE_BASE_URL_LOCAL,
  PUBLIC_SITE_BASE_URL_PRODUCTION,
} = process.env;

export default () => ({
  port: parseInt(PORT, 10),
  env: NODE_ENV,
  publicSiteLocal: PUBLIC_SITE_BASE_URL_LOCAL,
  publicSiteProduction: PUBLIC_SITE_BASE_URL_PRODUCTION,
});
