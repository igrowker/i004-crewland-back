import { Module } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { FestivalController } from './festival.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festival } from './entities/festival.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Festival])],
  controllers: [FestivalController],
  providers: [FestivalService],
  exports: [FestivalService],
})
export class FestivalModule { }
