import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Reservations])]
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule { }
