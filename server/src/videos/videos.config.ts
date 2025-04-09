import { Prisma } from '@prisma/client';

export const findVideoIncludeConfig: Prisma.VideoInclude = {
  likes: true,
  channel: true,
  views: true,
};

export const DELETE_VIDEO_JOB_NAME = 'delete-video';
