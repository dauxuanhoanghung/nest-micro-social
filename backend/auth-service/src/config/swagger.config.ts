import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Auth Service API Documentation')
  .setDescription(
    'The Auth Service API Documentation. It provides endpoints for user authentication, authorization and other related features such as login management',
  )
  .setVersion('0.0.1')
  .setLicense(
    'Apache License Version 2.0',
    'https://www.apache.org/licenses/LICENSE-2.0',
  )
  .build();
