import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { appConfig } from './config/app.config';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogActionModule } from './modules/log-action/log-action.module';
import { LoggerModule } from './modules/logger/logger.module';
import { PasswordManagementModule } from './modules/password-management/password-management.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { RegistrationModule } from './modules/registration/registration.module';
import { VerificationModule } from './modules/verification/verification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development'],
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'postgres',
        password: configService.get<string>('DB_PASSWORD') || 'password',
        database: configService.get<string>('DB_NAME') || 'auth_service',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || ''],
            queue: 'user_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
    EventEmitterModule.forRoot(),

    AuthModule,
    AccountModule,
    LogActionModule,
    LoggerModule,
    PasswordManagementModule,
    RefreshTokenModule,
    RegistrationModule,
    VerificationModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
