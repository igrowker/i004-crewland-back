import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './middleware/logger/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { ResponseFormatInterceptor } from './shared/interceptors/response-format.interceptor';
import dotenvOptions from './config/dotenv.config';
import * as bodyParser from 'body-parser';
import { ErrorHandlingCloudinary } from './middleware/cloudinary/error-handling.cloudinary';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);

  // app.enableCors();
  app.use(logger.use.bind(logger));
  app.use(bodyParser.json());
  app.use(new ErrorHandlingCloudinary().use);
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
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
