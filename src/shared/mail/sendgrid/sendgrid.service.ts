import { Injectable, InternalServerErrorException } from '@nestjs/common';
import dotEnvOptions from 'src/config/dotenv.config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService {
  constructor() {
    sgMail.setApiKey(dotEnvOptions.SENDGRID_API_KEY);
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    const msg = {
      to,
      from: dotEnvOptions.SENDGRID_FROM_EMAIL,
      replyTo: dotEnvOptions.SENDGRID_REPLY_TO,
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error('Error al enviar correo:', error.response?.body || error);
      throw new InternalServerErrorException('No se pudo enviar el correo.');
    }
  }
}
