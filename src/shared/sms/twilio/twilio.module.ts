import { Global, Module } from '@nestjs/common';
import { SmsService } from './twilio.service';
import { VerificationController } from './twilio.controller';
import { VerificationCode } from './entities/twilio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([VerificationCode]), VerificationCode],
  controllers: [VerificationController],
  providers: [SmsService],
  exports: [SmsService],
})
export class TwilioModule {}
