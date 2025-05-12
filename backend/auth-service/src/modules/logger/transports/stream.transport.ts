import { Injectable } from '@nestjs/common';
import { Writable } from 'stream';
import * as winston from 'winston';
import { ILogTransport } from '../interfaces/log-transport.interface';

@Injectable()
export class StreamTransport implements ILogTransport {
  private logger: winston.Logger;
  private appName = 'Auth-Service';

  constructor(stream: Writable) {
    const formatter = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.json(),
    );

    const streamTransport = new winston.transports.Stream({
      stream,
      format: formatter,
    });

    this.logger = winston.createLogger({
      level: 'verbose',
      defaultMeta: { service: this.appName },
      transports: [streamTransport],
    });
  }

  log(level: string, message: string, context?: string, trace?: string) {
    const winstonLevel = level === 'LOG' ? 'info' : level.toLowerCase();

    this.logger.log({
      level: winstonLevel,
      message,
      context,
      ...(trace && { trace }),
    });
  }
}
