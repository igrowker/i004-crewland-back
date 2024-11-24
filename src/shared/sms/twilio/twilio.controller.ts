import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SmsService } from './twilio.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly smsService: SmsService) {}

  // Endpoint para enviar el código de verificación
  @Post('send')
  async sendVerificationCode(@Body('phone') phone: string): Promise<string> {
    // Llamamos al servicio que enviará el SMS
    await this.smsService.sendVerificationCode(phone);
    return 'Código de verificación enviado';
  }

  // Endpoint para verificar el código
  @Post('verify')
  async verifyCode(
    @Body('code') code: string, // Solo el código de verificación enviado en el body
  ): Promise<string> {
    try {
      // Llamamos al servicio para verificar el código
      const isVerified = await this.smsService.verifyCode(code);

      if (isVerified) {
        return 'Código verificado con éxito';
      } else {
        throw new BadRequestException('Código incorrecto o expirado');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
