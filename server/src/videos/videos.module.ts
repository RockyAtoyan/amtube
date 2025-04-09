import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { bullQueues } from 'src/configs/bullmq.config';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideosSseService } from './videos.sse';
import { VideosWorker } from './videos.worker';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    BullModule.registerQueue(bullQueues.video),
  ],
  controllers: [VideosController],
  providers: [VideosService, VideosWorker, VideosSseService],
})
export class VideosModule {}
