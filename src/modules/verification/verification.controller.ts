import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { VerificationService } from './email-verification.service';
import { SmsServiceVerification } from './sms-verification.service';

@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly smsServiceVerification: SmsServiceVerification,
  ) {}

  // Endpoint para enviar el código de verificación
  @Post('send-email')
  @HttpCode(HttpStatus.OK)
  async sendVerificationCode(@Body('email') email: string): Promise<void> {
    console.log('Email received:', email);
    await this.verificationService.sendVerificationCode(email);
    return;
  }

  // Endpoint para validar el código de verificación
  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateVerificationCode(
    @Body('code') code: string,
  ): Promise<{ valid: boolean }> {
    const isValid = await this.verificationService.validateCode(code);
    return { valid: isValid };
  }

  // Endpoint para enviar el código de verificación por SMS
  @Post('send-sms')
  @HttpCode(HttpStatus.OK)
  async sendSmsVerificationCode(@Body('phone') phone: string): Promise<string> {
    await this.smsServiceVerification.sendVerificationCode(phone);
    return 'Código de verificación enviado por SMS';
  }

  // Endpoint para verificar el código recibido por SMS
  @Post('validate-sms')
  @HttpCode(HttpStatus.OK)
  async validateSmsCode(@Body('code') code: string): Promise<string> {
    try {
      const isVerified = await this.smsServiceVerification.verifyCode(code);

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
