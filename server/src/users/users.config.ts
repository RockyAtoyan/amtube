import { Prisma } from '@prisma/client';

export const findUserIncludeConfig: Prisma.UserInclude = {
  channel: {
    include: {
      subscribers: true,
    },
  },
  notifications: true,
  subscribes: true,
  playlists: {
    include: { videos: true, channel: true },
  },
  
};
