import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

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
}
