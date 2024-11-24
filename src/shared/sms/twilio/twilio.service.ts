import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCode } from './entities/twilio.entity'; // Asegúrate de que la ruta sea correcta
import axios from 'axios';

@Injectable()
export class SmsService {
  private textbeltUrl: string = 'https://textbelt.com/text';

  constructor(
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
  ) {}

  async sendSms(to: string, body: string): Promise<void> {
    try {
      const response = await axios.post(this.textbeltUrl, {
        phone: to,
        message: body,
        key: 'textbelt',
      });

      if (response.data.success) {
        console.log('Mensaje enviado con éxito');
      } else {
        console.error('Error al enviar el mensaje:', response.data);
      }
    } catch (error) {
      console.error('Error en la solicitud a Textbelt:', error);
    }
  }

  // Método para generar el código y guardarlo en la base de datos
  async sendVerificationCode(phone: string): Promise<void> {
    // Generamos un código aleatorio de 4 dígitos
    const code = Math.floor(1000 + Math.random() * 9000).toString();

    // Guardamos el código en la base de datos con la fecha de creación
    const newVerificationCode = this.verificationCodeRepository.create({
      code: code,
      verified: false,
    });

    await this.verificationCodeRepository.save(newVerificationCode);

    const message = `Tu código de verificación es: ${code}. Este código expira en 2 minutos.`;

    await this.sendSms(phone, message);

    console.log('Código de verificación enviado a', phone);

    // Establecemos un temporizador para eliminar el código después de 2 minutos
    setTimeout(
      async () => {
        await this.verificationCodeRepository.delete({
          code: code,
          verified: false,
        });
        console.log(
          `Código de verificación ${code} eliminado después de 2 minutos`,
        );
      },
      10 * 60 * 1000,
    );
  }

  async verifyCode(code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { code: code, verified: false },
    });

    // Si no se encuentra el código, es incorrecto o ya fue verificado
    if (!verificationCode) {
      throw new BadRequestException('Código incorrecto o ya verificado');
    }

    // Comprobamos si han pasado más de 2 minutos desde que se generó el código
    const codeAgeInMinutes =
      (new Date().getTime() - verificationCode.createdAt.getTime()) / 1000 / 60;

    // Si han pasado más de 2 minutos, eliminamos el código
    if (codeAgeInMinutes > 2) {
      await this.verificationCodeRepository.delete({ code: code });
      throw new BadRequestException('Código expirado');
    }

    // Si el código es válido, lo marcamos como verificado
    verificationCode.verified = true;
    await this.verificationCodeRepository.save(verificationCode);

    return true;
  }
}
