import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { LoginGuard } from 'src/shared/guards/login/login.guard';
import { ResetPasswordDto } from './dto/auth.reset-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    description: 'Cuerpo de solicitud para iniciar sesión',
    type: AuthLoginDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoginGuard)
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.authService.login(authLoginDto);
  }
  @Post('restore-password')
  @ApiBody({
    description:
      'Cuerpo de la solicitud para pedir una restauración de contraseña',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description:
            'Correo electrónico del usuario para restaurar contraseña',
          example: 'usuario@example.com',
        },
      },
      required: ['email'],
    },
  })
  @ApiResponse({ status: 200, description: 'Correo enviado.' })
  @ApiResponse({ status: 400, description: 'Petición inválida.' })
  async restorePasswordEmail(@Body('email') email: string): Promise<void> {
    return await this.authService.restorePasswordEmail(email);
  }

  @Post('verify-recovery-code/:token')
  async verifyRecoveryCode(
    @Param('token') token: string,
    @Body() { code }: { code: string },
  ): Promise<{ nextToken: string }> {
    const nextToken = await this.authService.verifyRecoveryCode(token, code);
    return { nextToken };
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string, // El token va en los params
    @Body() resetPasswordDto: ResetPasswordDto, // Recibes el DTO con las contraseñas
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, resetPasswordDto);
    return { message: 'Contraseña restablecida con éxito.' };
  }
}
