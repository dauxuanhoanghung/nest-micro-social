import { Writable } from 'stream';

import { ILogTransport } from '../interfaces/log-transport.interface';
import { TransportType } from '../logger.constants';
import { ConsoleTransport } from '../transports/console.transport';
import { FileTransport } from '../transports/file.transport';
import { HttpTransport } from '../transports/http.transport';
import { StreamTransport } from '../transports/stream.transport';

export class TransportFactory {
  static createConsoleTransport(appName?: string): ILogTransport {
    const transport = new ConsoleTransport();
    if (appName) {
      Object.defineProperty(transport, 'appName', {
        value: appName,
      });
    }
    return transport;
  }

  /**
   * Create a file transport
   */
  static createFileTransport(options?: {
    appName?: string;
    dirname?: string;
    maxSize?: string;
    maxFiles?: string;
  }): ILogTransport {
    const transport = new FileTransport();
    if (options?.appName) {
      Object.defineProperty(transport, 'appName', {
        value: options.appName,
      });
    }
    // You can set more options here
    return transport;
  }

  /**
   * Create an HTTP transport
   */
  static createHttpTransport(options: {
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
  }): ILogTransport {
    return new HttpTransport(options);
  }

  /**
   * Create a stream transport
   */
  static createStreamTransport(
    stream: Writable,
    appName?: string,
  ): ILogTransport {
    const transport = new StreamTransport(stream);
    if (appName) {
      Object.defineProperty(transport, 'appName', {
        value: appName,
      });
    }
    return transport;
  }

  /**
   * Create a transport from a type and options
   */
  static createTransport(
    type: TransportType | string,
    options?: any,
  ): ILogTransport {
    switch (type) {
      case TransportType.CONSOLE:
        return this.createConsoleTransport(options?.appName);
      case TransportType.FILE:
        return this.createFileTransport(options);
      case TransportType.HTTP:
        return this.createHttpTransport(options);
      case TransportType.STREAM:
        return this.createStreamTransport(options.stream, options?.appName);
      default:
        throw new Error(`Unknown transport type: ${type}`);
    }
  }
}
