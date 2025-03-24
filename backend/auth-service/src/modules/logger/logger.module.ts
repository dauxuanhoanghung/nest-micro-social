import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ILogTransport } from './interfaces/log-transport.interface';
import { LOGGER_TOKEN } from './logger.constants';
import { LoggerService } from './logger.service';
import { ConsoleTransport } from './transports/console.transport';
import { FileTransport } from './transports/file.transport';

export interface LoggerModuleOptions {
  console?: {
    enabled?: boolean;
  };
  files?: {
    [key: string]: {
      filename: string;
      maxSize?: string;
      maxFiles?: string | number; // e.g., '14d' or 10
      level?: string; // e.g., 'info', 'error'
    };
  };
}

@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions = {}): DynamicModule {
    const defaultOptions: LoggerModuleOptions = {
      console: {
        enabled: true, // Enabled by default in non-production
      },
      files: {
        application: {
          filename: 'application',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info', // Default level for general logs
        },
        error: {
          filename: 'error',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'error', // Dedicated file for errors/exceptions
        },
      },
    };

    // Merge default options with provided options
    const mergedOptions: LoggerModuleOptions = {
      console: { ...defaultOptions.console, ...options.console },
      files: { ...defaultOptions.files, ...(options.files || {}) },
    };

    const providers: Provider[] = [
      {
        provide: LOGGER_TOKEN,
        useFactory: (configService: ConfigService) => {
          const isProduction =
            configService.get<string>('NODE_ENV') === 'production';
          const transports: ILogTransport[] = [];
          if (mergedOptions.console?.enabled && !isProduction) {
            transports.push(new ConsoleTransport());
          }

          if (mergedOptions.files) {
            Object.values(mergedOptions.files).forEach((fileConfig) => {
              transports.push(
                new FileTransport({
                  filename: fileConfig.filename,
                  maxSize: fileConfig.maxSize,
                  maxFiles: fileConfig.maxFiles,
                  level: fileConfig.level,
                }),
              );
            });
          }

          return { transports };
        },
        inject: [ConfigService],
      },
      LoggerService,
    ];

    return {
      module: LoggerModule,
      imports: [ConfigModule],
      providers,
      exports: [LoggerService],
      global: true,
    };
  }

  static forFeature(
    filename: string,
    options: {
      maxSize?: string;
      maxFiles?: string | number;
      level?: string;
    } = {},
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: LOGGER_TOKEN,
        useFactory: () => ({
          transports: [
            new FileTransport({
              filename,
              maxSize: options.maxSize || '20m',
              maxFiles: options.maxFiles || '14d',
              level: options.level || 'info', // Default level
            }),
          ],
        }),
      },
      LoggerService,
    ];

    return {
      module: LoggerModule,
      providers,
      exports: [LoggerService],
    };
  }
}
