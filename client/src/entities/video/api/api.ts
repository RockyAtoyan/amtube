import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Video } from "../model/video";
import { VideoWithRelations } from "../model/video-with-relations";

export interface CreateVideoDto extends FormData {}
export interface CreateVideoResponse extends Video {}

export interface UpdateVideoDto extends Partial<CreateVideoDto> {}
export type UpdateVideoResponse = Video;

export type FindAllVideoResponse = {
  videos: VideoWithRelations[];
  totalCount: number;
};

export type GetTrendingResponse = VideoWithRelations[];
export type GetExploreResponse = VideoWithRelations[];
export type FindOneVideoResponse = VideoWithRelations;
export type FindSimilarVideoResponse = VideoWithRelations[];

export class VideosApi {
  static async processVideoFile(dto: CreateVideoDto) {
    const res = await authInstance.post<CreateVideoResponse>(
      ROUTES.videos.processVideoFile.path,
      dto,
    );
    return res.data;
  }

  static async sse() {
    const res = await authInstance.get(ROUTES.videos.sse.path);
    return res.data;
  }

  static async findAll(
    page: number,
    searchTerm?: string,
    filter?: "popular" | "latest" | "newest" | "likes",
    limit?: number,
  ) {
    const res = await publicInstance.get<FindAllVideoResponse>(
      ROUTES.videos.findAll.path,
      {
        params: {
          page,
          searchTerm,
          filter,
          limit,
        },
      },
    );
    return res.data;
  }

  static async getTrending(page: number, limit?: number) {
    const res = await publicInstance.get<GetTrendingResponse>(
      ROUTES.videos.getTrending.path,
      {
        params: {
          page,
          limit,
        },
      },
    );
    return res.data;
  }

  static async getExplore() {
    const res = await authInstance.get<GetExploreResponse>(
      ROUTES.videos.getExplore.path,
    );
    return res.data;
  }

  static async findOne(id: string) {
    const res = await publicInstance.get<FindOneVideoResponse>(
      ROUTES.videos.findOne.path + "/" + id,
    );
    return res.data;
  }

  static async findSimilar(id: string, page: number, limit?: number) {
    const res = await publicInstance.get<FindSimilarVideoResponse>(
      ROUTES.videos.findSimilar.path,
      {
        params: { id, page, limit },
      },
    );
    return res.data;
  }

  static async update(id: string, dto: UpdateVideoDto) {
    const res = await authInstance.patch<UpdateVideoResponse>(
      ROUTES.videos.update.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdateVideoResponse>(
      ROUTES.videos.delete.path + "/" + id,
    );
    return res.data;
  }
}
