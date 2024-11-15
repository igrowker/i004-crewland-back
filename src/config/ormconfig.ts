import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

//en ves de process.env capaz seria importando las variables del dotenvConfig.ts
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  host: process.env.DB_HOST,
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

// entities: [ Usuario , Aplicacion , Comentario , Pago , Proyecto, Habilidad, Categoria ],
