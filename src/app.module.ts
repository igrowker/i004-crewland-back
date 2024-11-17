import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonLoggerService } from './middleware/logger/logger.middleware';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/ormconfig';
import { FestivalModule } from './modules/festival/festival.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ChatModule } from './modules/chat/chat.module';
import { PublicationsModule } from './modules/publications/publications.module';

@Module({
  imports: [
    UsersModule,
    ReservationsModule,
    ChatModule,
    PublicationsModule,
    FestivalModule,
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [AppController],
  providers: [AppService, WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class AppModule {}
