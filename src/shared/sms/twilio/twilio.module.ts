import { Global, Module } from '@nestjs/common';
import { SmsService } from './twilio.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [SmsService],
  exports: [SmsService],
})
export class TwilioModule {}
