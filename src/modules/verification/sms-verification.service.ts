import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationCodeSms } from './entities/sms-verification.entity';
import { SmsService } from 'src/shared/sms/twilio/twilio.service';

@Injectable()
export class SmsServiceVerification {
  constructor(
    @InjectRepository(VerificationCodeSms)
    private verificationCodeRepository: Repository<VerificationCodeSms>,
    private SmsService: SmsService,
  ) {}

  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendVerificationCode(phone: string): Promise<void> {
    const code = this.generateVerificationCode();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 2);

    const newVerificationCode = this.verificationCodeRepository.create({
      code: code,
      verified: false,
      createdAt: new Date(),
      expiresAt: expiresAt,
    });

    try {
      await this.verificationCodeRepository.save(newVerificationCode);
      const message = `Tu código de verificación es: ${code}. Este código expira en 2 minutos.`;

      await this.SmsService.sendSms(phone, message);
      console.log('Código de verificación enviado a', phone);

      setTimeout(
        async () => {
          await this.verificationCodeRepository.delete({
            code,
            verified: false,
          });
          console.log(`Código ${code} eliminado después de 2 minutos.`);
        },
        2 * 60 * 1000,
      );
    } catch (error) {
      console.error(
        'Error al enviar el código de verificación:',
        error.message,
      );
      throw new BadRequestException(
        'No se pudo enviar el código de verificación',
      );
    }
  }

  // Método para verificar el código de verificación
  async verifyCode(code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: { code, verified: false },
    });

    if (!verificationCode) {
      throw new BadRequestException('Código incorrecto o ya verificado');
    }

    // Verificamos si el código ha expirado
    const currentTime = new Date().getTime();
    if (currentTime > verificationCode.expiresAt.getTime()) {
      await this.verificationCodeRepository.delete({ code });
      throw new BadRequestException('Código expirado');
    }

    // Marcamos el código como verificado
    verificationCode.verified = true;
    await this.verificationCodeRepository.save(verificationCode);

    return true;
  }
}
