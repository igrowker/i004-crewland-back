import * as dotenv from 'dotenv';

dotenv.config();

// const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_TOKEN_EXPIRED = process.env.JWT_TOKEN_EXPIRED;
const DB_PORT = process.env.DB_PORT;
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_MIGRATE_DATA = process.env.DB_MIGRATE_DATA;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const SENDGRIP_AUTH_TOKEN = process.env.SENDGRID_AUTH_TOKEN;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const SENDGRID_REPLY_TO = process.env.SENDGRID_REPLY_TO;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

const dotEnvOptions = {
  SENDGRIP_AUTH_TOKEN,
  SENDGRID_FROM_EMAIL,
  SENDGRID_REPLY_TO,
  SENDGRID_API_KEY,
  TWILIO_WHATSAPP_NUMBER,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  PORT,
  JWT_SECRET,
  JWT_TOKEN_EXPIRED,
  DB_PORT,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_MIGRATE_DATA,
};

export default dotEnvOptions;
