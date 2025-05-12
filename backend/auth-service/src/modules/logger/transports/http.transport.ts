import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as winston from 'winston';

import { ILogTransport } from '../interfaces/log-transport.interface';

interface HttpTransportOptions {
  host: string;
  path: string;
  ssl?: boolean;
  port?: number;
  auth?: {
    username: string;
    password: string;
  };
  headers?: Record<string, string>;
  batch?: boolean;
  batchInterval?: number;
  batchCount?: number;
}

@Injectable()
export class HttpTransport implements ILogTransport {
  private logger: winston.Logger;
  private options: HttpTransportOptions;
  private logBuffer: any[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor(options: HttpTransportOptions) {
    this.options = {
      host: options.host,
      path: options.path,
      ssl: options.ssl || false,
      port: options.port || (options.ssl ? 443 : 80),
      auth: options.auth,
      headers: options.headers || {},
      batch: options.batch || false,
      batchInterval: options.batchInterval || 5000, // default 5 seconds
      batchCount: options.batchCount || 10, // default batch size
    };

    // Create a custom HTTP transport using axios
    const httpTransport = new winston.transports.Http({
      host: this.options.host,
      path: this.options.path,
      ssl: this.options.ssl,
      port: this.options.port,
      auth: this.options.auth,
    });

    this.logger = winston.createLogger({
      level: 'verbose',
      defaultMeta: { service: 'Auth-Service' },
      transports: [httpTransport],
    });

    // If batching is enabled, initialize the batch processor
    if (this.options.batch) {
      this.initBatchProcessor();
    }
  }

  private initBatchProcessor() {
    this.batchTimer = setInterval(() => {
      void this.flushLogs();
    }, this.options.batchInterval);
  }

  private async flushLogs() {
    if (this.logBuffer.length === 0) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const logs = [...this.logBuffer];
    this.logBuffer = [];

    try {
      const protocol = this.options.ssl ? 'https' : 'http';
      const url = `${protocol}://${this.options.host}:${this.options.port}${this.options.path}`;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      await axios.post(
        url,
        { logs },
        {
          headers: this.options.headers,
          auth: this.options.auth
            ? {
                username: this.options.auth.username,
                password: this.options.auth.password,
              }
            : undefined,
        },
      );
    } catch (error) {
      console.error('Failed to send logs batch to HTTP endpoint:', error);
    }
  }

  log(level: string, message: string, context?: string, trace?: string) {
    const winstonLevel = level === 'LOG' ? 'info' : level.toLowerCase();
    const logData = {
      level: winstonLevel,
      message,
      context,
      ...(trace && { trace }),
      timestamp: new Date().toISOString(),
    };

    if (this.options.batch) {
      // Add to batch
      this.logBuffer.push(logData);

      // If we've reached the batch count, flush immediately
      if (this.logBuffer.length >= (this.options.batchCount || 10)) {
        void this.flushLogs();
      }
    } else {
      // Log immediately
      this.logger.log(logData);
    }
  }

  // Clean up when the service is destroyed
  onModuleDestroy() {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      void this.flushLogs(); // Flush any remaining logs
    }
  }
}
