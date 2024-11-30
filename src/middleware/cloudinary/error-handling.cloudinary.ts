import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlingCloudinary implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Captura cualquier error lanzado por el siguiente middleware o controlador
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        const responseBody = {
          status: 'error',
          message: res.locals.message || 'An error occurred',
        };
        // Solo envía la respuesta si no se ha enviado ya
        if (!res.headersSent) {
          res.json(responseBody);
        }
      }
    });

    next();
  }
}
