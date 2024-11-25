/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginDto } from './dto/auth.login.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ForgotPasswordDto } from './dto/forgotPasswor.dto';
import { SendGridService } from 'src/shared/mail/sendgrid/sendgrid.service';
import {resetPassTemplate} from 'src/shared/utils/resetPassTemplate';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly sendGridService: SendGridService,
  ) { }


  async login(authLoginDto: AuthLoginDto): Promise<any> {
    console.log('JWT Secret desde el controlador:', (this.jwtService as any).options.secret);
    const { email, password } = authLoginDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new UnauthorizedException(
          'Los datos ingresados no son correctos.',
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException(
          'Los datos ingresados no son correctos.',
        );
      }

      const payload = { email: user.email, sub: user.id, role: user.role };
      const token = this.jwtService.sign(payload);

      const aux = {
        userData: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          tel: user.tel,
          age: user.age,
          gender: user.gender,
          role: user.role,
          preferences: user.preferences,
          travelHistory: user.travelHistory,
          favorites: user.favorites,
        },
        token,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Un error ha surgido en el inicio de sesión',
      );
    }
  }

  async requestPasswordReset(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        return new UnauthorizedException(`No se logro encontrar al usuario con el email: ${email}`);
      }

      const token = this.jwtService.sign({ userId: user.id }, { expiresIn: '2h' });

      //genera el codigo de 4 digitos y reemplazalo en el template
      const tbodyRegex = /<strong id="code">(.*?)<\/strong>/s;
      const emailTemplate = resetPassTemplate.replace(tbodyRegex, `<strong id="code">1234</strong>`);

      const aux = await this.sendGridService.sendEmail(email,
        "Recuperar contraseña",
        `Dale a este link para recuperar tu contraseña`,
        `
        <h1>Link</h1>
        <p>http://localhost:3000/restore-password/reset-password?token=${token}</p>
        <div>
          ${emailTemplate}
        </div>
        `);

      return { message: 'Correo de recuperación enviado' };

    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  //actualizar y restaura contraseña aca
}
