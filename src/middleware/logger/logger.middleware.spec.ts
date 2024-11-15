import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.ip;

    const startTime = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const endTime = Date.now();
      const duration = endTime - startTime;
      const date = new Date();
      const timestamp = date.toISOString();

      const colors = {
        reset: '\x1b[0m',
        timestamp: '\x1b[36m',
        method: '\x1b[32m',
        url: '\x1b[34m',
        ip: '\x1b[33m',
        status: '\x1b[31m',
        duration: '\x1b[35m',
        border: '\x1b[44m',
      };

      const borderLine = `${colors.border}==============================${colors.reset}`;
      const logEntry =
        `${borderLine}\n` +
        `${colors.timestamp}[${timestamp}]${colors.reset}\n` +
        `${colors.method}Method: ${method}${colors.reset}\n` +
        `${colors.url}URL: ${originalUrl}${colors.reset}\n` +
        `${colors.ip}IP: ${ip}${colors.reset}\n` +
        `${colors.status}Status: ${statusCode}${colors.reset}\n` +
        `${colors.duration}Duration: ${duration}ms${colors.reset}\n` +
        `${borderLine}`;

      console.log(logEntry);
    });

    next();
  }
}
