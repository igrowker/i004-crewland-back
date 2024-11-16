import { DataSource, DataSourceOptions } from 'typeorm';
import { Chat } from '../modules/chat/entities/chat.entity';
import { Publication } from '../modules/publications/entities/publication.entity';
import { Reservations } from 'src/modules/reservations/entities/reservation.entity';
import User from '../modules/users/entities/user.entity';
import Festival from '../modules/festival/entities/festival.entity';

import dotEnvOptions from './dotenv.config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(dotEnvOptions.DB_PORT || '5432', 10),
  host: dotEnvOptions.DB_HOST,
  username: dotEnvOptions.DB_USERNAME,
  password: dotEnvOptions.DB_PASSWORD,
  database: dotEnvOptions.DB_NAME,
  //OJO aca: el dropSchema = true es probable q te elimine las tablas cada ves q se inicia el server
  dropSchema: false,
  //otra opcion es synchonize true q borre las tablas, para desarrollo esta perfecto pero para produccion no es recomendable ya q puede alterar la db sin control
  //npx typeorm migration:generate -n CreateInitialTables --> Este comando generará una migración en la carpeta de migraciones (usualmente en src/migrations o en una ruta que hayas configurado).
  //npx typeorm migration:run --> Esto ejecutará todas las migraciones pendientes y creará las tablas necesarias en la base de datos.
  synchronize: true, //esto para q se sinconice auto y no tener q correr el comando de migracion
  logging: false,
  entities: [Publication, Chat, User, Reservations, Festival],
  subscribers: [],
  migrations: [],
};

export const AppDataSource = new DataSource(dataSourceOptions);
