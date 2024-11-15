import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN_EXPIRED = process.env.JWT_TOKEN_EXPIRED;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

const dotEnvOptions = {
  DATABASE_URL,
  PORT,
  JWT_SECRET,
  JWT_TOKEN_EXPIRED,
  DB_PORT,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
};

export default dotEnvOptions;
