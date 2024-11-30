import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import dotEnvOptions from 'src/config/dotenv.config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(
        'Token de autorización no proporcionado.',
      );
    }

    const tokenBearer = authHeader.split(' ');

    if (tokenBearer.length !== 2 || tokenBearer[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de token incorrecto');
    }

    const token = tokenBearer[1];
    const secret = this.configService.get<string>(dotEnvOptions.JWT_SECRET);

    try {
      const decodedToken = this.jwtService.verify(token, { secret });

      // Validar que el token contenga los datos necesarios
      if (!decodedToken || !decodedToken.sub || !decodedToken.userId) {
        throw new UnauthorizedException('Token inválido');
      }

      request['user'] = {
        id: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role,
      };

      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token expirado');
      } else {
        throw new UnauthorizedException('Token inválido');
      }
    }
  }
}