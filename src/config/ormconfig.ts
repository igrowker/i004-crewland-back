import { DataSource, DataSourceOptions } from 'typeorm';
import { Chat } from '../modules/chat/entities/chat.entity';
import { Publication } from '../modules/publications/entities/publication.entity';
import User from '../modules/users/entities/user.entity';

import dotEnvOptions from './dotenv.config';

console.log('DB_HOST:', dotEnvOptions.DB_HOST);
console.log('DB_PORT:', dotEnvOptions.DB_PORT);
console.log('DB_USERNAME:', dotEnvOptions.DB_USERNAME);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(dotEnvOptions.DB_PORT || '5432', 10),
  host: dotEnvOptions.DB_HOST,
  username: dotEnvOptions.DB_USERNAME,
  password: dotEnvOptions.DB_PASSWORD,
  database: dotEnvOptions.DB_NAME,
  dropSchema: true,
  synchronize: true,
  logging: false,
  entities: [Publication, Chat, User],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
