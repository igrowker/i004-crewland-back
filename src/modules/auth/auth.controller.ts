import {
  Controller,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { LoginGuard } from 'src/shared/guards/login/login.guard';
import { RestorePasswordEmailDto } from './dto/auth.restore-password-email.dto';
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
    type: RestorePasswordEmailDto,
  })
  @ApiResponse({ status: 200, description: 'Correo enviado.' })
  @ApiResponse({ status: 400, description: 'Petición inválida.' })
  async restorePasswordEmail(
    @Body() restorePasswordEmailDto: RestorePasswordEmailDto,
  ) {
    return await this.authService.restorePasswordEmail(restorePasswordEmailDto);
  }

  // validate CODE
  @Post('verify-recovery-code')
  @ApiQuery({
    name: 'token',
    description: 'Token recibido en el correo electrónico de recuperación',
    required: true,
  })
  @ApiBody({
    description: 'Código de recuperación proporcionado por el usuario',
    schema: {
      type: 'object',
      properties: {
        recoveryCode: {
          type: 'string',
          example: '1234',
          description: 'Código de 4 cifras enviado al correo del usuario.',
        },
      },
      required: ['recoveryCode'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Código de recuperación verificado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Solicitud inválida. El código de recuperación o el token es incorrecto.',
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado.' })
  async verifyRecoveryCode(
    @Query('token') token: string,
    @Body('recoveryCode') recoveryCode: string,
  ): Promise<void> {
    return await this.authService.verifyRecoveryCode(token, recoveryCode);
  }

  @Post('reset-password')
  @ApiQuery({
    name: 'token',
    description: 'Token para validación de reestablecimiento de la contraseña',
    required: true,
  })
  @ApiBody({
    description: 'Datos requeridos para restablecer la contraseña.',
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Token inválido o datos incorrectos.',
  })
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(token, resetPasswordDto);
  }
}
