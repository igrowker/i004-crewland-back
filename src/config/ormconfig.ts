import { DataSource, DataSourceOptions } from 'typeorm';
import { Chat } from '../modules/chat/entities/chat.entity';
import { Publication } from '../modules/publications/entities/publication.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';
import { User } from '../modules/users/entities/user.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Festival } from '../modules/festivals/entities/festival.entity';
import { VerificationCode } from '../shared/twilio/entities/twilio.entity';

import dotEnvOptions from './dotenv.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(dotEnvOptions.DB_PORT || '5432', 10),
  host: dotEnvOptions.DB_HOST,
  username: dotEnvOptions.DB_USERNAME,
  password: dotEnvOptions.DB_PASSWORD,
  database: dotEnvOptions.DB_NAME,
  dropSchema: dotEnvOptions.DB_MIGRATE_DATA === 'true',
  synchronize: true,
  logging: false,
  entities: [
    Festival,
    Publication,
    Chat,
    User,
    Reservations,
    Auth,
    VerificationCode,
  ],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
