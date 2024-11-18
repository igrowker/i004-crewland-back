import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from './dto/auth.register.dto';
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

  async register(authRegisterDto: AuthRegisterDto): Promise<any> {
    const { name, username, email, password, confirmPassword, tel } = authRegisterDto

    try {

      if (password !== confirmPassword) {
        throw new ConflictException('Contraseña y confirmar contraseña no coinciden')
      }

      const existingUser = await this.userRepository.findOne({
        where: [{ email }, { username }]
      })

      if (existingUser) {
        throw new ConflictException(
          'El correo o el nombre de usuario ya han sido usados.'
        )
      }

      const hashPassword: string = await bcrypt.hash(password, 10)

      const user = this.userRepository.create({
        name,
        username,
        email,
        password: hashPassword,
        tel,
      })

      await this.userRepository.save(user)

      return { message: 'Usuario registrado correctamente' }

    } catch (error) {
      throw new InternalServerErrorException('Ha surgido un error inesperado en el registro',)
    }
  }

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
