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

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({
    description: 'Cuerpo de solicitud para iniciar sesión',
    type: AuthLoginDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario iniciado sesión correctamente.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuario o contraseña incorrectos.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario o contraseña incorrectos.',
          description: 'Mensaje de error.',
        },
      },
      required: ['message'],
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuario no autorizado.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario no autorizado.',
          description: 'Mensaje de error.',
        },
      },
      required: ['message'],
    },
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Correo enviado con el código de recuperación.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Correo enviado con el código de recuperación.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Petición inválida.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Petición inválida.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al enviar el correo.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Error al enviar el correo.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  // @ApiResponse({ status: 200, description: 'Correo enviado.' })
  // @ApiResponse({ status: 400, description: 'Petición inválida.' })
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
    status: HttpStatus.OK,
    description: 'Código de recuperación verificado correctamente.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Código de recuperación verificado correctamente.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Solicitud inválida.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example:
            'Solicitud inválida. El código de recuperación o el token es incorrecto.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido o expirado.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Token inválido o expirado.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Código de recuperación verificado correctamente.',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description:
  //     'Solicitud inválida. El código de recuperación o el token es incorrecto.',
  // })
  // @ApiResponse({ status: 401, description: 'Token inválido o expirado.' })
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
    status: HttpStatus.OK,
    description: 'Contraseña restablecida correctamente.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Contraseña restablecida correctamente.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Token inválido o datos incorrectos.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Token inválido o datos incorrectos.',
          description: 'Mensaje de error.',
        },
      },
    },
  })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Contraseña restablecida correctamente.',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Token inválido o datos incorrectos.',
  // })
  async resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(token, resetPasswordDto);
  }
}
