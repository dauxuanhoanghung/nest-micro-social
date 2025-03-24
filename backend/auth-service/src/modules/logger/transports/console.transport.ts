import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { ILogTransport } from '../interfaces/log-transport.interface';

// ANSI color codes for terminal output
const clc = {
  bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
  green: (text: string) => `\x1B[32m${text}\x1B[39m`,
  yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
  red: (text: string) => `\x1B[31m${text}\x1B[39m`,
  magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
  cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

// Color scheme matching nestLike
const colorScheme: Record<string, (text: string) => string> = {
  info: clc.green,
  log: clc.green,
  error: clc.red,
  warn: clc.yellow,
  debug: clc.magentaBright,
  verbose: clc.cyanBright,
};

const yellow =
  process.env.NO_COLOR === 'true' ? (text: string) => text : clc.yellow;

@Injectable()
export class ConsoleTransport implements ILogTransport {
  private logger: winston.Logger;
  private appName = 'Auth-Service';

  constructor() {
    this.logger = winston.createLogger({
      level: 'verbose', // Log all levels
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
            winston.format.ms(),
            winston.format.printf(
              ({ context, level, timestamp, message, ms }) => {
                const displayLevel = level === 'info' ? 'log' : level;
                const formattedContext = context || 'Application';
                const formattedLevel = displayLevel.toUpperCase();
                const color =
                  process.env.NO_COLOR === 'true'
                    ? (text: string) => text
                    : colorScheme[displayLevel] || ((text: string) => text);
                return (
                  `${color('[' + this.appName + ']')} ${color(String(process.pid)).padEnd(6)} - ` +
                  `${timestamp as string} ${color(formattedLevel.padStart(7))} - ` +
                  (context
                    ? `${yellow('[' + (formattedContext as string) + ']')} `
                    : '') +
                  `${color(message as string)}` +
                  (ms ? ` ${yellow(ms as string)}` : '')
                );
              },
            ),
          ),
        }),
      ],
    });
  }

  log(level: string, message: string, context?: string, trace?: string) {
    const winstonLevel = level === 'LOG' ? 'info' : level.toLowerCase();
    if (trace && winstonLevel === 'error') {
      this.logger.log({
        level: winstonLevel,
        message: `${message}\n${trace}`,
        context,
      });
    } else {
      this.logger.log({
        level: winstonLevel,
        message,
        context,
      });
    }
  }
}
