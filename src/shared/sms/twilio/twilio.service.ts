import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private textbeltUrl: string = 'https://textbelt.com/text';

  constructor() {}

  async sendSms(to: string, body: string): Promise<void> {
    try {
      const response = await axios.post(this.textbeltUrl, {
        phone: to,
        message: body,
        key: 'textbelt',
      });

      if (response.data.success) {
        console.log('Mensaje enviado con éxito a:', to);
      } else {
        console.error('Error al enviar el mensaje:', response.data);
      }
    } catch (error) {
      console.error('Error en la solicitud a Textbelt:', error.message);
    }
  }
}
