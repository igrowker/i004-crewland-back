import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonLoggerService } from './middleware/logger/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/ormconfig';
import { FestivalModule } from './modules/festivals/festival.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ChatModule } from './modules/chat/chat.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { ResponseFormatInterceptor } from './shared/interceptors/response-format.interceptor';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ReservationsModule,
    ChatModule,
    PublicationsModule,
    FestivalModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WinstonLoggerService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: ResponseFormatInterceptor,
    },
  ],
  exports: [WinstonLoggerService],
})
export class AppModule {}
