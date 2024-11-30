import { Injectable } from '@nestjs/common';
import dotEnvOptions from '../../../../config/dotenv.config';

@Injectable()
export class SendGridConfig {
  get apiKey(): string {
    return dotEnvOptions.SENDGRID_API_KEY;
  }

  get fromEmail(): string {
    return dotEnvOptions.SENDGRID_FROM_EMAIL;
  }

  get replyTo(): string {
    return dotEnvOptions.SENDGRID_REPLY_TO;
  }
}
