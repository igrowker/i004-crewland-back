import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const { email, password } = request.body

    if (!email || !password) {
      throw new UnauthorizedException('Correo y contraseña requeridos')
    }

    // se podria crear un servicio que chequease si el usuario existe en la db

    return true;
  }
}
