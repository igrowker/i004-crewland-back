import * as dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

const dotEnvOptions = {
  DATABASE_URL,
  PORT,
};

export default dotEnvOptions;
