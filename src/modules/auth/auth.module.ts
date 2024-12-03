import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { SendGridService } from 'src/shared/mail/sendgrid/sendgrid.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SendGridService],
})
export class AuthModule {}
