import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from 'src/shared/cloudinary/cloudinary.service';
import { SendGridService } from 'src/shared/mail/sendgrid/sendgrid.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, CloudinaryService, SendGridService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
