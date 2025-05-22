import { Prisma } from '@prisma/client';

export const findVideoIncludeConfig: Prisma.VideoInclude = {
  likes: true,
  dislikes: true,
  channel: true,
  views: true,
};

export const DELETE_VIDEO_JOB_NAME = 'delete-video';
