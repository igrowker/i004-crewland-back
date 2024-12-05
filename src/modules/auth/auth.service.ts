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
import { SendGridService } from 'src/shared/mail/sendgrid/sendgrid.service';
import { ResetPasswordDto } from './dto/auth.reset-password.dto';
import dotEnvOptions from 'src/config/dotenv.config';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly sendGripService: SendGridService,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<any> {
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

      const payload = {
        email: user.email,
        sub: user.id,
        userId: user.id,
        role: user.role,
      };
      const token = this.jwtService.sign(payload);

      return {
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
          image: user.image,
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

  generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async loadTemplateWithCode(code: string, resetLink: string): Promise<string> {
    const templatePath = path.join(
      __dirname,
      '../../shared/utils/restorePasswordCode.html',
    );
    console.log('Template path:', templatePath);
    const template = await fs.readFileSync(templatePath, 'utf8');
    return template.replace('{{code}}', code).replace('{{token}}', resetLink);
  }

  async restorePasswordEmail(email: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException(
          `Usuario no encontrado con el email: ${email}`,
        );
      }

      const recoveryCode = this.generateVerificationCode();
      const token = this.jwtService.sign(
        { id: user.id, recoveryCode },
        { expiresIn: '5m' },
      );

      const resetLink = `${dotEnvOptions.FRONTEND_URL}/restore-password/reset-password?token=${token}`;

      const emailTemplate = await this.loadTemplateWithCode(
        recoveryCode,
        resetLink,
      );

      await this.sendGripService.sendEmail(
        email,
        'Restaurar contraseña',
        `Tu código de recuperación es: ${recoveryCode}. El enlace para restablecer tu contraseña está en el correo.`,
        emailTemplate,
      );
    } catch (error) {
      console.error('Error enviando el email de restaurar contraseña: ', error);

      throw new InternalServerErrorException(
        'No se ha podido enviar el email para restaurar la contraseña.',
      );
    }
  }

  async verifyRecoveryCode(
    token: string,
    inputRecoveryCode: string,
  ): Promise<string> {
    try {
      const { id, recoveryCode } = this.jwtService.verify(token);

      if (recoveryCode !== inputRecoveryCode) {
        throw new UnauthorizedException('Código de recuperación inválido.');
      }

      console.log(
        `Código de recuperación verificado para usuario con ID: ${id}`,
      );
      return token;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Código de recuperación expirado.');
      }
      throw new UnauthorizedException('Token inválido.');
    }
  }

  async resetPassword(
    token: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    try {
      console.log('Recibiendo el token:', token);

      // Verificar el token
      const decoded = this.jwtService.verify(token);
      console.log('Token decodificado:', decoded);

      const { id } = decoded; // Desestructurar el ID del token

      // Buscar al usuario por ID
      const user = await this.userRepository.findOne({ where: { id } });
      console.log('Usuario encontrado:', user);

      if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
      }

      // Comparar la nueva contraseña con la anterior
      const isSamePassword = await bcrypt.compare(
        resetPasswordDto.newPassword,
        user.password,
      );
      console.log('Contraseña nueva es igual a la anterior:', isSamePassword);

      if (isSamePassword) {
        throw new BadRequestException(
          'La nueva contraseña no puede ser igual a la contraseña anterior.',
        );
      }

      // Generar el hash de la nueva contraseña
      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        10,
      );
      console.log('Nueva contraseña hasheada:', hashedPassword);

      // Actualizar la contraseña del usuario
      user.password = hashedPassword;
      await this.userRepository.save(user);

      console.log(`Contraseña actualizada para usuario con ID: ${id}`);
    } catch (error) {
      console.error(
        'Error durante el restablecimiento de la contraseña:',
        error,
      );

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('El token ha expirado.');
      }
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
