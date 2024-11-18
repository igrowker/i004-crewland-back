import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiBody({
    description: 'Cuerpo de la solicitud para registro de nuevo usuario',
    type: AuthRegisterDto,
  })
  async create(@Res({ passthrough: true }) res: Response, @Body() authRegisterDto: AuthRegisterDto) {
    return await this.authService.register(authRegisterDto);
  }

  @Post('login')
  @ApiBody({
    description: 'Cuerpo de solicitud para iniciar sesión',
    type: AuthLoginDto,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.authService.login(authLoginDto)
  }
}
