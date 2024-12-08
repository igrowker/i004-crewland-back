import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Publication } from './entities/publication.entity';
import { ConfigModule } from '@nestjs/config';
import { FestivalsModule } from '../festivals/festivals.module';
import { GeneralEntityValidationGuard } from 'src/shared/guards/user-validator/general-validator.guard';
import { FestivalsService } from '../festivals/festivals.service';
import { CloudinaryModule } from 'src/shared/cloudinary/cloudinary.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { SendgridModule } from 'src/shared/mail/sendgrid/sendgrid.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publication]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRED },
    }),
    ConfigModule,
    FestivalsModule,
    CloudinaryModule,
    UsersModule,
    SendgridModule,
  ],

  controllers: [PublicationsController],
  providers: [
    PublicationsService,
    FestivalsService,
    GeneralEntityValidationGuard,
    UsersService,
  ],
})
export class PublicationsModule {}
