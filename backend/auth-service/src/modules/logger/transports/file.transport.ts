import { Injectable } from '@nestjs/common';
import { Format } from 'logform';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { ILogTransport } from '../interfaces/log-transport.interface';

export interface FileTransportOptions {
  appName?: string;
  level?: string;
  errorFile?: {
    enabled?: boolean;
    dirname?: string;
    filename?: string;
    datePattern?: string;
    maxSize?: string;
    maxFiles?: string;
    zippedArchive?: boolean;
  };
  combinedFile?: {
    enabled?: boolean;
    dirname?: string;
    filename?: string;
    datePattern?: string;
    maxSize?: string;
    maxFiles?: string;
    zippedArchive?: boolean;
  };
  format?: {
    timestamp?: boolean;
    timestampFormat?: string;
    json?: boolean;
    prettyPrint?: boolean;
    colorize?: boolean;
  };
}

const defaultOptions: FileTransportOptions = {
  appName: 'App',
  level: 'verbose',
  errorFile: {
    enabled: true,
    dirname: 'logs',
    filename: 'error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: false,
  },
  combinedFile: {
    enabled: true,
    dirname: 'logs',
    filename: 'combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    zippedArchive: false,
  },
  format: {
    timestamp: true,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    json: true,
    prettyPrint: false,
    colorize: false,
  },
};

@Injectable()
export class FileTransport implements ILogTransport {
  private logger: winston.Logger;
  private appName: string;
  private options: FileTransportOptions;

  constructor(options?: FileTransportOptions) {
    this.options = this.mergeDefaultOptions(options || defaultOptions);
    this.appName = this.options.appName || 'App';

    const formatters: Format[] = [];
    if (this.options.format?.timestamp !== false) {
      formatters.push(
        winston.format.timestamp({
          format: this.options.format?.timestampFormat || 'YYYY-MM-DD HH:mm:ss',
        }),
      );
    }

    if (this.options.format?.prettyPrint) {
      formatters.push(winston.format.prettyPrint());
    }

    if (this.options.format?.json !== false) {
      formatters.push(winston.format.json());
    }

    if (this.options.format?.colorize) {
      formatters.push(winston.format.colorize());
    }

    const formatter = winston.format.combine(...formatters);

    const transports: winston.transport[] = [];

    // Add error file transport if enabled
    if (this.options.errorFile?.enabled !== false) {
      transports.push(
        new winston.transports.DailyRotateFile({
          level: 'error',
          dirname: this.options.errorFile?.dirname || 'logs',
          filename: this.options.errorFile?.filename || 'error-%DATE%.log',
          datePattern: this.options.errorFile?.datePattern || 'YYYY-MM-DD',
          maxSize: this.options.errorFile?.maxSize || '20m',
          maxFiles: this.options.errorFile?.maxFiles || '14d',
          zippedArchive: this.options.errorFile?.zippedArchive || false,
          format: formatter,
        }),
      );
    }

    // Add combined file transport if enabled
    if (this.options.combinedFile?.enabled !== false) {
      transports.push(
        new winston.transports.DailyRotateFile({
          dirname: this.options.combinedFile?.dirname || 'logs',
          filename:
            this.options.combinedFile?.filename || 'combined-%DATE%.log',
          datePattern: this.options.combinedFile?.datePattern || 'YYYY-MM-DD',
          maxSize: this.options.combinedFile?.maxSize || '20m',
          maxFiles: this.options.combinedFile?.maxFiles || '14d',
          zippedArchive: this.options.combinedFile?.zippedArchive || false,
          format: formatter,
        }),
      );
    }

    this.logger = winston.createLogger({
      level: this.options.level || 'verbose', // Log all levels by default
      defaultMeta: { service: this.appName },
      transports,
    });
  }

  private mergeDefaultOptions(
    options: FileTransportOptions,
  ): FileTransportOptions {
    return {
      appName: options.appName || 'App',
      level: options.level || 'verbose',
      errorFile: {
        enabled: options.errorFile?.enabled !== false,
        dirname: options.errorFile?.dirname || 'logs',
        filename: options.errorFile?.filename || 'error-%DATE%.log',
        datePattern: options.errorFile?.datePattern || 'YYYY-MM-DD',
        maxSize: options.errorFile?.maxSize || '20m',
        maxFiles: options.errorFile?.maxFiles || '14d',
        zippedArchive: options.errorFile?.zippedArchive || false,
      },
      combinedFile: {
        enabled: options.combinedFile?.enabled !== false,
        dirname: options.combinedFile?.dirname || 'logs',
        filename: options.combinedFile?.filename || 'combined-%DATE%.log',
        datePattern: options.combinedFile?.datePattern || 'YYYY-MM-DD',
        maxSize: options.combinedFile?.maxSize || '20m',
        maxFiles: options.combinedFile?.maxFiles || '14d',
        zippedArchive: options.combinedFile?.zippedArchive || false,
      },
      format: {
        timestamp: options.format?.timestamp !== false,
        timestampFormat:
          options.format?.timestampFormat || 'YYYY-MM-DD HH:mm:ss',
        json: options.format?.json !== false,
        prettyPrint: options.format?.prettyPrint || false,
        colorize: options.format?.colorize || false,
      },
    };
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
