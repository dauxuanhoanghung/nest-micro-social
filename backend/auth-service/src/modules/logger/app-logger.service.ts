/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  ConsoleLogger,
  Injectable,
  LoggerService,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private static DEFAULT_LOG_FILES = [
    {
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    },
    {
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    },
  ];

  private context?: string;
  private winstonLogger: winston.Logger;
  private console: ConsoleLogger;
  private isProduction: boolean;

  constructor(configService: ConfigService) {
    this.console = new ConsoleLogger();
    this.isProduction = configService.get<string>('NODE_ENV') === 'production';

    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const defaultLogFiles: DailyRotateFile[] = AppLogger.DEFAULT_LOG_FILES.map(
      (file) => {
        const options: DailyRotateFile.DailyRotateFileTransportOptions = {
          dirname: logDir,
          ...file,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        };

        return new winston.transports.DailyRotateFile(options);
      },
    );

    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: winston.Logform.TransformableInfo) => {
          const { timestamp, level, message, context, ...meta } = info;

          const timestampStr = timestamp ? timestamp : new Date().toISOString();
          const levelStr = level ? level.toUpperCase() : 'INFO';
          const messageStr = message ? message : '';
          const contextStr = context ? context : 'App';

          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';

          return `[${timestampStr}] [${levelStr}] [${contextStr}] ${messageStr} ${metaStr}`;
        }),
      ),
      transports: defaultLogFiles,
    });

    if (this.isProduction) {
      this.winstonLogger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.printf(
              ({ timestamp, level, message, context, ...meta }) => {
                return `[Nest] ${process.pid}  - ${timestamp}  ${level} [${context || 'App'}] ${message} ${
                  Object.keys(meta).length ? JSON.stringify(meta) : ''
                }`;
              },
            ),
          ),
        }),
      );
    }
  }

  setContext(context: string) {
    this.context = context;
    this.console.setContext(context);
    return this;
  }

  log(message: any, context?: string) {
    context = context || this.context;

    this.winstonLogger.info(message, { context });
    if (!this.isProduction) {
      this.console.log(message, context);
    }
  }

  error(message: any, trace?: string, context?: string) {
    context = context || this.context;

    this.winstonLogger.error(message, { context, trace });

    if (!this.isProduction) {
      this.console.error(message, trace, context);
    }
  }

  warn(message: any, context?: string) {
    context = context || this.context;

    this.winstonLogger.warn(message, { context });

    if (!this.isProduction) {
      this.console.warn(message, context);
    }
  }

  debug(message: any, context?: string) {
    context = context || this.context;

    this.winstonLogger.debug(message, { context });

    if (!this.isProduction) {
      this.console.debug(message, context);
    }
  }

  verbose(message: any, context?: string) {
    context = context || this.context;

    this.winstonLogger.verbose(message, { context });

    if (!this.isProduction) {
      this.console.verbose(message, context);
    }
  }
}
