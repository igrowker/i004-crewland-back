import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-csrf';

@Injectable()
export class CsrfGuard extends AuthGuard('csrf') {}

@Injectable()
export class CsrfStrategy extends PassportStrategy(Strategy, 'csrf') {
  constructor() {
    super({
      secret: process.env.CSRF_SECRET || 'tu_secreto_csrf', // Usa una variable de entorno
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-Token',
    });
  }

  validate(payload: any) {
    return true;
  }
}

//// abria q actualizar el app.module incluryendo esta estrategia
/*
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CsrfStrategy } from './shared/guards/csrf/csrf.guard';

@Module({
  imports: [PassportModule],
  providers: [CsrfStrategy],
})
export class AppModule { }
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
