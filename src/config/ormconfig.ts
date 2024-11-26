import { DataSource, DataSourceOptions } from 'typeorm';
import { Message } from '../modules/chat/entities/chat.entity';
import { Publication } from '../modules/publications/entities/publication.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';
import { User } from '../modules/users/entities/user.entity';
import { Auth } from 'src/modules/auth/entities/auth.entity';
import { Festivals } from '../modules/festivals/entities/festival.entity';
import { VerificationCodeEmail } from '../modules/verification/entities/email-verification.entity';

import dotEnvOptions from './dotenv.config';
import { VerificationCodeSms } from 'src/modules/verification/entities/sms-verification.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(dotEnvOptions.DB_PORT || '5432', 10),
  host: dotEnvOptions.DB_HOST,
  username: dotEnvOptions.DB_USERNAME,
  password: dotEnvOptions.DB_PASSWORD,
  database: dotEnvOptions.DB_NAME,
  dropSchema: dotEnvOptions.DB_MIGRATE_DATA === 'false',
  synchronize: true,
  logging: false,
  entities: [
    Festivals,
    Publication,
    Message,
    User,
    Reservations,
    Auth,
    VerificationCodeSms,
    VerificationCodeEmail,
  ],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
