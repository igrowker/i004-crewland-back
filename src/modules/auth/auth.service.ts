/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { ResetPasswordDto } from './dto/resetPassword.dot';

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

      return aux;
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

      console.log(user);

      if (!user) {
        return new UnauthorizedException(`No se logro encontrar al usuario con el email: ${email}`);
      }

      const token = this.jwtService.sign({ id: user.id }, { expiresIn: '2h' });

      //genera el codigo de 4 digitos y reemplazalo en el template
      const code = Math.floor(1000 + Math.random() * 9000).toString();

      //FALTA GUARDAR CODIGO EN DB Y VALIDARLO EN RESETPASS

      //remplazo de el code en el template
      const strongRegex = /<strong id="code">(.*?)<\/strong>/s;
      const emailTemplate = resetPassTemplate.replace(strongRegex, `<strong id="code">${code}</strong>`);

      const aux = await this.sendGridService.sendEmail(email,
        "Recuperar contraseña",
        `Dale a este link para recuperar tu contraseña`,
        `
        <div>
        ${emailTemplate}
        </div>
        <div>
          <h1>Link de recuperacion de contraseña</h1>
          <p>http://localhost:3000/restore-password/reset-password?token=${token}</p>
        </div>
        `); //OJO: hay q cambiar este link por una varible de entorno y por la url del front

      return { message: 'Correo de recuperación enviado' };

    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    try {

      const decodedToken = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({ where: { id: decodedToken.id } });

      //FALTA GUARDAR CODIGO DE 4 DIGS EN DB EN LA FUN REQUESTPASSREST Y VALIDARLO ACA
      
      if (!user) {
        return new NotFoundException('Usuario no encontrado');
      }

      if (resetPasswordDto.newPassword !== resetPasswordDto.repeatPassword) {
        return new BadRequestException('Las contraseñas no coinciden.');
      }

      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
      user.password = hashedPassword;

      const aux =await this.userRepository.save(user);

      console.log(aux);

      return { message: 'Contraseña actualizada correctamente.' };
    } catch (error) {
      throw new InternalServerErrorException('Ocurrió un error al procesar la solicitud de restablecimiento de contraseña.');
    }
  }
}

// User {
//   id: 'f9883bf2-df83-4f4b-9dda-d29cc62e0415',
//   password: '$2a$10$ex1AtT9GTXUYkLaQIBqFRe5YF0qWitehZbH8vZnFjbrU77Q2gLgv.',
//   name: 'Ulises Rodriguez',
//   username: 'uli5',
//   email: 'ulirodriguez5@gmail.com',
//   age: '1997-05-27',
//   tel: '+542302411290',
//   gender: 'hombre',
//   role: 'user',
//   preferences: [ 'movies', 'sports' ],
//   travelHistory: [ 'Paris', 'Tokyo' ],
//   favorites: [ 'Pizza', 'Reading' ]
// }