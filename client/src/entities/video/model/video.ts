export interface Video {
  id: string;
  publicId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoSrc: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  channelId: string;
}
