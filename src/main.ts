import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './middleware/logger/logger.middleware';
import * as bodyParser from 'body-parser';
import dotenvOptions from './config/dotenv.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);

  // Registrar WinstonLoggerService como middleware global
  app.enableCors();
  app.use(logger.use.bind(logger));
  app.use(bodyParser.json());
  //agrego para validaciones de dto
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(dotenvOptions.PORT, () =>
    logger.log(
      `Servidor funcionando en el puerto: ${dotenvOptions.PORT}`,
      'Bootstrap',
    ),
  );
}
bootstrap();
