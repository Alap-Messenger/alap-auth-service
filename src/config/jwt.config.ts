import * as dotenv from 'dotenv';
dotenv.config();

const {
  JWT_PUBLIC_KEY_PATH,
  JWT_PRIVATE_KEY_PATH,
  JWT_SECRET,
  JWT_EXPIRES_IN,
} = process.env;

export default () => ({
  jwt: {
    publicKeyPath: JWT_PUBLIC_KEY_PATH,
    privateKeyPath: JWT_PRIVATE_KEY_PATH,
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
  },
});
