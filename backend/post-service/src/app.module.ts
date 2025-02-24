import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { PrivaciesModule } from './privacies/privacies.module';

@Module({
  imports: [PrismaModule, PostsModule, TagsModule, PrivaciesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
