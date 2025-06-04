import { Prisma } from '@prisma/client';
import { findVideoIncludeConfig } from 'src/videos/videos.config';

export const findUserIncludeConfig: Prisma.UserInclude = {
  channel: {
    include: {
      subscribers: true,
      playlists: true,
    },
  },
  likedAnswers: true,
  likedComments: true,
  notifications: {
    orderBy: { createdAt: 'desc' },
  },
  subscribes: true,
  playlists: {
    include: {
      user: true,
      channel: true,
      videos: { include: findVideoIncludeConfig },
    },
  },
  savedPlaylists: {
    include: {
      user: true,
      channel: true,
      videos: { include: findVideoIncludeConfig },
    },
  },
};
