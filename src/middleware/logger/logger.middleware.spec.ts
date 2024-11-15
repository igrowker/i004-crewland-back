import { WinstonLoggerService } from './logger.middleware';

describe('WinstonLoggerService', () => {
  it('should be defined', () => {
    expect(new WinstonLoggerService()).toBeDefined();
  });
});
