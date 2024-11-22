/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginDto } from './dto/auth.login.dto';
import * as bcrypt from 'bcryptjs';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  
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

      const payload = { username: user.username, sub: user.id, email: user.email };
      console.log(payload);
      const token = this.jwtService.sign(payload);
      console.log(token);
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
console.log(aux);
      return aux;
    } catch (error) {
      throw new InternalServerErrorException(
        'Un error ha surgido en el inicio de sesión',
      );
    }
  }
}
