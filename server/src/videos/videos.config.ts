import { Prisma } from '@prisma/client';

export const findVideoIncludeConfig: Prisma.VideoInclude = {
  likes: true,
  channel: true,
  views: true,
};
