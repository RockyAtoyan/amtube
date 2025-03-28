import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AnswersModule } from './answers/answers.module';
import { CACHE_TTL_TIME } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { CommentsModule } from './comments/comments.module';
import { DbModule } from './db/db.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { WebsocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    CacheModule.register({
      ttl: CACHE_TTL_TIME,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DbModule,
    UsersModule,
    AuthModule,
    MailModule,
    MediaModule,
    ChannelsModule,
    VideosModule,
    PlaylistsModule,
    CommentsModule,
    AnswersModule,
    NotificationsModule,
    WebsocketModule,
    TagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
