import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Publication } from './entities/publication.entity';
import { ConfigModule } from '@nestjs/config';
import { FestivalModule } from '../festivals/festival.module';
import { GeneralEntityValidationGuard } from 'src/shared/guards/user-validator/general-validator.guard';
import { FestivalService } from '../festivals/festival.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Publication]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRED },
    }),
    ConfigModule,
    FestivalModule
  ],
  controllers: [PublicationsController],
  providers: [PublicationsService, FestivalService, GeneralEntityValidationGuard],
})
export class PublicationsModule { }
