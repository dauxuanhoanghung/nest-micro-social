import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { TOKEN_CONFIG, TOKEN_SERVICE } from './token.constants';
import { TokenService } from './token.service';

export interface TokenModuleOptions {
  accessToken?: {
    secret?: string;
    expiresIn?: number;
  };
  refreshToken?: {
    secret?: string;
    expiresIn?: number;
  };
}

@Module({})
export class TokenModule {
  static register(options: TokenModuleOptions = {}): DynamicModule {
    const tokenConfigProvider: Provider = {
      provide: TOKEN_CONFIG,
      useValue: options,
    };

    return {
      module: TokenModule,
      imports: [ConfigModule, JwtModule.register({})],
      providers: [
        {
          useClass: TokenService,
          provide: TOKEN_SERVICE,
        },
        tokenConfigProvider,
      ],
      exports: [TOKEN_SERVICE],
    };
  }
}
