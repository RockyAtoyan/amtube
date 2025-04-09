export interface ProcessVideoJobPayload {
  videoId: string;
  videoFileName: string;
  videoFile: Express.Multer.File;
  userId: string;
  isDeleting?: boolean;
  videoSrc?: string;
}

export enum VideoFilterEnum {
  POPULAR = 'popular',
  LATEST = 'latest',
  NEWEST = 'newest',
  LIKES = 'likes',
}

export type VideoFilter = VideoFilterEnum;
