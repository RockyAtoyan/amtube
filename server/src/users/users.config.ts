import { Prisma } from '@prisma/client';

export const findUserIncludeConfig: Prisma.UserInclude = {
  channel: {
    include: {
      subscribers: true,
      playlists: true,
    },
  },
  notifications: true,
  subscribes: true,
  playlists: {
    include: {
      user: true,
      channel: true,
      videos: { include: { channel: true } },
    },
  },
};
