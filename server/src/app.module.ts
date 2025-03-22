import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { MailModule } from './mail/mail.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: 'uploads',
    }),
    DbModule,
    UsersModule,
    AuthModule,
    MailModule,
    MediaModule,
    ChannelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
