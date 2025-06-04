import { Video } from "@/entities/video/model/video";

import { Tag } from "./tag";

export interface TagWithRelations extends Tag {
  videos: Video[];
}
