import { Module } from '@nestjs/common';
import { FestivalsService } from './festivals.service';
import { FestivalsController } from './festivals.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Festivals } from './entities/festival.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Festivals]), ConfigModule],
  controllers: [FestivalsController],
  providers: [FestivalsService, CloudinaryService],
  exports: [TypeOrmModule],
})
export class FestivalsModule {}
