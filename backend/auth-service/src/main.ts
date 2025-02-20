import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/filters/bad-request-exception.filter';
import { EntityNotFoundExceptionFilter } from './common/filters/entity-not-found-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { swaggerConfig } from './config/swagger.config';
import { AppLogger } from './modules/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix(configService.get<string>('APP.PREFIX') || '');
  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new EntityNotFoundExceptionFilter(),
    new HttpExceptionFilter(),
  );

  const logger = await app.resolve(AppLogger);
  logger.setContext('Bootstrap');
  app.useLogger(logger);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://admin:password@localhost:5672'],
      queue: 'auth_queue',
      queueOptions: { durable: false },
    },
  });

  if (configService.get<boolean>('APP.SWAGGER.enabled')) {
    SwaggerModule.setup(
      configService.get<string>('APP.SWAGGER.path') || '/api/docs',
      app,
      () => SwaggerModule.createDocument(app, swaggerConfig),
    );
  }

  await app.startAllMicroservices();
  const port = configService.get<number>('APP.PORT') ?? 3001;
  await app.listen(port, () => {
    if (configService.get('NODE_ENV') === 'development') {
      logger.log(`Auth service is running on ${port}`);
    }
  });
}

bootstrap().catch((e) => {
  console.error('Fail to start the auth service: ', e);
});
