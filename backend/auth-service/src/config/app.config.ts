import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('APP', () => ({
  PORT: 3001,
  PREFIX: 'api/auth-service',
  cors: {
    enabled: true,
    origins: ['http://localhost:3000'],
  },
  SWAGGER: {
    enabled: true,
    path: 'api/docs',
  },
  rateLimit: {
    ttl: 60,
    limit: 100,
  },
}));
