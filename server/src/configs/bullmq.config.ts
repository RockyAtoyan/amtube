import { BullRootModuleOptions, RegisterQueueOptions } from '@nestjs/bullmq';

export const bullRootModuleOptions: BullRootModuleOptions = {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
  },
  defaultJobOptions: {
    attempts: 3,
  },
};

export const VIDEO_QUEUE_NAME = 'video';
export const bullQueues: Record<string, RegisterQueueOptions> = {
  video: { name: VIDEO_QUEUE_NAME },
};
