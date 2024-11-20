import { Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLoggerService implements LoggerService, NestMiddleware {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message} ${context ? `(${context})` : ''
            }`;
        }),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    });
  }

  // Métodos LoggerService
  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug?(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose?(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Middleware para registrar solicitudes HTTP
  use(req: any, res: any, next: () => void) {
    const { method, url } = req;
    const userAgent = req.headers['user-agent'] || '';
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      this.log(
        `${method} ${url} ${statusCode} - ${userAgent} - ${duration}ms`,
        'HttpLogger',
      );
    });

    next();
  }
}
