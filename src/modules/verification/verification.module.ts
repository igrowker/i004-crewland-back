import { Module } from '@nestjs/common';
import { VerificationService } from './email-verification.service';
import { SmsServiceVerification } from './sms-verification.service';
import { VerificationController } from './verification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendgridModule } from '../../shared/mail/sendgrid/sendgrid.module';
import { VerificationCodeEmail } from './entities/email-verification.entity';
import { VerificationCodeSms } from './entities/sms-verification.entity';
import { TwilioModule } from 'src/shared/sms/twilio/twilio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VerificationCodeEmail, VerificationCodeSms]),
    SendgridModule,
    TwilioModule,
  ],
  providers: [VerificationService, SmsServiceVerification],
  controllers: [VerificationController],
})
export class VerificationModule {}
