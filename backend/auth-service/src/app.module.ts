import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { appConfig } from './config/app.config';
import { AccountModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { LogActionModule } from './modules/log-action/log-action.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', '.env.development'],
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'Admin@123',
      database: 'auth_service',
      synchronize: true,
      autoLoadEntities: true,
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

    AuthModule,
    AccountModule,
    LogActionModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
