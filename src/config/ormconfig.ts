import { DataSource, DataSourceOptions } from 'typeorm';
import { Message } from '../modules/chat/entities/message.entity';
import { Room } from 'src/modules/chat/entities/room.entity';
import { Publication } from '../modules/publications/entities/publication.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';
import { User } from '../modules/users/entities/user.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Festivals } from '../modules/festivals/entities/festival.entity';
import { VerificationCodeSms } from '../modules/verification/entities/sms-verification.entity';
import { VerificationCodeEmail } from '../modules/verification/entities/email-verification.entity';

import dotEnvOptions from './dotenv.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(dotEnvOptions.DB_PORT || '5432', 10),
  host: dotEnvOptions.DB_HOST,
  username: dotEnvOptions.DB_USERNAME,
  password: dotEnvOptions.DB_PASSWORD,
  database: dotEnvOptions.DB_NAME,
  // dropSchema: dotEnvOptions.DB_MIGRATE_DATA === 'false',
  dropSchema: false,
  // url: dotEnvOptions.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [
    Festivals,
    Publication,
    Message,
    User,
    Reservations,
    Auth,
    Room,
    VerificationCodeSms,
    VerificationCodeEmail,
  ],
  subscribers: [],
  migrations: [],
  ssl:
    dotEnvOptions.DB_SSL === true
      ? {
          rejectUnauthorized:
            dotEnvOptions.DB_SSL_REJECT_UNAUTHORIZED === false ? false : true,
        }
      : false,

  // ssl: dotEnvOptions.DB_SSL
  // ? { rejectUnauthorized: dotEnvOptions.DB_SSL_REJECT_UNAUTHORIZED }
  // : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
