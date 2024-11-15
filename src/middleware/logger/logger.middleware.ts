// import { LoggerService, Injectable } from '@nestjs/common';
// import * as winston from 'winston';

// @Injectable()
// export class WinstonLoggerService implements LoggerService {
//   private logger: winston.Logger;

//   constructor() {
//     this.logger = winston.createLogger({
//       level: process.env.LOG_LEVEL || 'info',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message, context }) => {
//           return `${timestamp} [${level.toUpperCase()}]: ${message} ${context ? `(${context})` : ''}`;
//         }),
//       ),
//       transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({
//           filename: 'logs/error.log',
//           level: 'error',
//         }),
//         new winston.transports.File({ filename: 'logs/combined.log' }),
//       ],
//     });
//   }

//   log(message: string, context?: string) {
//     this.logger.info(message, { context });
//   }

//   error(message: string, trace?: string, context?: string) {
//     this.logger.error(message, { trace, context });
//   }

//   warn(message: string, context?: string) {
//     this.logger.warn(message, { context });
//   }

//   debug?(message: string, context?: string) {
//     this.logger.debug(message, { context });
//   }

//   verbose?(message: string, context?: string) {
//     this.logger.verbose(message, { context });
//   }
// }
