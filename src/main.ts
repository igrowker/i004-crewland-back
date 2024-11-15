import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenvOptions from './config/dotenv.config';
import * as bodyParser from 'body-parser';
import { WinstonLoggerService } from './middleware/logger/logger.middleware'; // Asegúrate de que la ruta sea correcta

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);

  app.useLogger(logger);
  app.enableCors();
  app.use(bodyParser.json());

  await app.listen(dotenvOptions.PORT, () =>
    console.log(`Servidor funcionando en el puerto: ${dotenvOptions.PORT}`),
  );
}
bootstrap();
