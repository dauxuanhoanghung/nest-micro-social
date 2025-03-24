import { Inject, Injectable, Scope } from '@nestjs/common';
import { ILogTransport } from './interfaces/log-transport.interface';
import { ILogger } from './interfaces/logger.interface';
import { LOGGER_TOKEN } from './logger.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILogger {
  private transports: ILogTransport[] = [];

  constructor(
    @Inject(LOGGER_TOKEN)
    readonly loggerConfig: { transports: ILogTransport[] },
  ) {
    this.transports = loggerConfig.transports;
  }

  log(message: string, context?: string) {
    this.transports.forEach((transport) =>
      transport.log('LOG', message, context),
    );
  }

  error(message: string, trace?: string, context?: string) {
    this.transports.forEach((transport) =>
      transport.log('ERROR', message, context, trace),
    );
  }

  warn(message: string, context?: string) {
    this.transports.forEach((transport) =>
      transport.log('WARN', message, context),
    );
  }

  debug(message: string, context?: string) {
    this.transports.forEach((transport) =>
      transport.log('DEBUG', message, context),
    );
  }
}
