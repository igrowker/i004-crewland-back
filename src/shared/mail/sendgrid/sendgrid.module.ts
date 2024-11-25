import { Module } from '@nestjs/common';
import { SendGridService } from './sendgrid.service';
import { SendGridConfig } from './config/sendgrip.config';

@Module({
  providers: [SendGridService, SendGridConfig],
  exports: [SendGridService],
})
export class SendgridModule {}
