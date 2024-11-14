import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN_EXPIRED = process.env.JWT_TOKEN_EXPIRED;

const dotEnvOptions = {
  DATABASE_URL,
  PORT,
  JWT_SECRET,
  JWT_TOKEN_EXPIRED,
};

export default dotEnvOptions;
