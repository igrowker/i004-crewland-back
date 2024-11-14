import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenvOptions from './config/dotenv.config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //habilita los cors
  app.enableCors();
  //convierte todo json q llega desde el fornt en JS
  app.use(bodyParser.json());

  await app.listen(dotenvOptions.PORT, () => console.log(dotenvOptions.PORT));
}
bootstrap();
