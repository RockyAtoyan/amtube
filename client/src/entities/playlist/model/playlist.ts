export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId?: string;
  channelId?: string;
}
