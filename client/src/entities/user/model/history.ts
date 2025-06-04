import { Video } from "@/entities/video/model/video";

import { User } from "./user";

export interface History {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  videoId: string;
}

export interface HistoryWithRelations extends History {
  user: User;
  video: Video;
}
