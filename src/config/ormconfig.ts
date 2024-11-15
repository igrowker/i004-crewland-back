import { DataSource, DataSourceOptions } from 'typeorm';
<<<<<<< HEAD
import dotEnvOptions from './dotenv.config';
=======
import { config as dotenvConfig } from 'dotenv';
import Publication from '../modules/publications/entities/publication.entity';
import { Chat } from '../modules/chat/entities/chat.entity';

dotenvConfig({ path: '.env' });
>>>>>>> 5cfad56f887ff36479147a0ea20f3a18d7a30921

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
  entities: [Publication, Chat],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
