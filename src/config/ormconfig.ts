import { DataSource, DataSourceOptions } from 'typeorm';
import dotEnvOptions from './dotenv.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  host: process.env.DB_HOST || dotEnvOptions.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
