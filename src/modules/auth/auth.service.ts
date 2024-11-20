import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginDto } from './dto/auth.login.dto';
import * as bcrypt from 'bcryptjs'
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, password } = authLoginDto

    try {

      const user = await this.userRepository.findOne({
        where: { email }
      })

      if (!user) {
        throw new UnauthorizedException('Los datos ingresados no son correctos.')
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        throw new UnauthorizedException('Los datos ingresados no son correctos.')
      }

      const payload = { username: user.username, sub: user.id }
      const token = this.jwtService.sign(payload)

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
        },
        token,
      }
    } catch (error) {
      throw new InternalServerErrorException('Un error ha surgido en el inicio de sesión')
    }
  }
}
