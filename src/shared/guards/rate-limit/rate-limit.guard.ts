import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private requests: Record<string, { count: number; lastRequest: number }> = {};
  private readonly WINDOW_SIZE = 15 * 60 * 1000;
  private readonly MAX_REQUESTS = 100;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip; // Puedes usar otra clave única, como el userId si está autenticado

    const currentTime = Date.now();

    if (!this.requests[ip]) {
      // Primera solicitud
      this.requests[ip] = { count: 1, lastRequest: currentTime };
      return true;
    }

    const requestInfo = this.requests[ip];
    const timeElapsed = currentTime - requestInfo.lastRequest;

    if (timeElapsed > this.WINDOW_SIZE) {
      // Ventana expirada, reinicia el contador
      this.requests[ip] = { count: 1, lastRequest: currentTime };
      return true;
    }

    if (requestInfo.count >= this.MAX_REQUESTS) {
      // Límite alcanzado
      throw new HttpException(
        'Has excedido el límite de solicitudes. Intenta de nuevo más tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Incrementa el contador
    this.requests[ip].count++;
    this.requests[ip].lastRequest = currentTime;

    return true;
  }
}
