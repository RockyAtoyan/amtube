import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { bullQueues } from 'src/configs/bullmq.config';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { VideosWorker } from './videos.worker';
import { VideosSseService } from './videos.sse'

@Module({
  imports: [BullModule.registerQueue(bullQueues.video)],
  controllers: [VideosController],
  providers: [VideosService, VideosWorker, VideosSseService],
})
export class VideosModule {}
