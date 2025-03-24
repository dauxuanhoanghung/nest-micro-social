export const LOGGER_DEFAULTS = {
  FILE: {
    DIR: 'logs',
    APPLICATION: {
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
    },
    ERROR: {
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    },
  },
  LEVELS: {
    ERROR: 'error',
    WARN: 'warn',
    INFO: 'info',
    VERBOSE: 'verbose',
    DEBUG: 'debug',
  },
};
export const LOGGER_TOKEN = 'LOGGER_TOKEN';
export const DEFAULT_LOGGER = 'application';
export const EXCEPTION_LOGGER = 'EXCEPTION_LOGGER';
