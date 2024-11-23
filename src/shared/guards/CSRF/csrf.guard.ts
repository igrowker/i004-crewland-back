import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Tokens } from 'csrf';

@Injectable()
export class CsrfGuard implements CanActivate {
  private tokens: Tokens;

  constructor() {
    this.tokens = new Tokens();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const secret = process.env.CSRF_SECRET || 'tu_secreto_csrf';
    const token = request.headers['x-csrf-token'] || request.body._csrf;

    if (!token) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (!this.tokens.verify(secret, token)) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    const newToken = this.tokens.create(secret);
    response.header('X-CSRF-Token', newToken);

    return true;
  }
}

//// abria q actualizar el app.module incluryendo esta estrategia
/*
import { Module } from '@nestjs/common';
import { CsrfGuard } from './shared/guards/csrf/csrf.guard';

@Module({
  providers: [CsrfGuard],
  exports: [CsrfGuard], // Exporta el guard para que esté disponible en otros módulos
})
export class AppModule {}
*/

/// y usarlo asi en el controllador
/*
import { Controller, UseGuards, Post } from '@nestjs/common';
import { CsrfGuard } from '../shared/guards/csrf/csrf.guard';

@Controller('tu-ruta')
export class TuControlador {
  @UseGuards(CsrfGuard)
  @Post()
  tuMetodo() {
    // Tu lógica aquí
  }
}
  */

// en el archivo main habria q:
/*
Importar cookieParser.
Añadir app.use(cookieParser()) para manejar cookies.
Ajustar la configuración de CORS para incluir credentials: true, lo cual es importante para que las cookies CSRF funcionen correctamente en solicitudes cross-origin.

app.enableCors({
    origin: true, // Ajusta esto según tus necesidades
    credentials: true, // Importante para CSRF
  });

Tb instalar cookie-parser:

npm install cookie-parser @types/cookie-parser
*/
