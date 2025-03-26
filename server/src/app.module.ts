import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { DbModule } from './db/db.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';
import { PlaylistsModule } from './playlists/playlists.module';
import { CommentsModule } from './comments/comments.module';
import { AnswersModule } from './answers/answers.module';
import { WebsocketGateway } from './websocket/websocket.gateway';

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
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}
