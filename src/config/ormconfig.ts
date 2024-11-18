import { DataSource, DataSourceOptions } from 'typeorm';
import { Chat } from '../modules/chat/entities/chat.entity';
import { Publication } from '../modules/publications/entities/publication.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';
import { User } from '../modules/users/entities/user.entity';
import { Festival } from '../modules/festivals/entities/festival.entity';

import dotEnvOptions from './dotenv.config';

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
  entities: [Festival, Publication, Chat, User, Reservations],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
