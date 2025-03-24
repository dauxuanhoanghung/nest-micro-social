export interface ILogTransport {
  log(level: string, message: string, context?: string, trace?: string): void;
}
