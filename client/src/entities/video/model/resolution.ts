import { Video } from "./video";

export interface Resolution {
  id: string;
  quality: string;
  resolution: number[];
}

export interface ResolutionWithRelations extends Resolution {
  videos: Video[];
}
