import { useMutation, useQuery } from "@tanstack/react-query";

import { UpdateVideoDto, VideosApi } from "./api";

export const useProcessVideoFile = () => {
  const { mutate: processVideoFile, ...rest } = useMutation({
    mutationFn: VideosApi.processVideoFile,
  });

  return { processVideoFile, ...rest };
};

export const useSse = () => {
  const { data: sseData, ...rest } = useQuery({
    queryKey: ["sse"],
    queryFn: VideosApi.sse,
  });

  return { sseData, ...rest };
};

export const useGetVideos = (
  page: number,
  searchTerm?: string,
  filter?: "popular" | "latest" | "newest" | "likes",
  limit?: number,
) => {
  const { data: videos, ...rest } = useQuery({
    queryKey: ["videos", page, searchTerm, filter, limit],
    queryFn: () => VideosApi.findAll(page, searchTerm, filter, limit),
  });

  return { videos, ...rest };
};

export const useGetTrendingVideos = (page: number, limit?: number) => {
  const { data: trendingVideos, ...rest } = useQuery({
    queryKey: ["trending-videos", page, limit],
    queryFn: () => VideosApi.getTrending(page, limit),
  });

  return { trendingVideos, ...rest };
};

export const useGetExploreVideos = () => {
  const { data: exploreVideos, ...rest } = useQuery({
    queryKey: ["explore-videos"],
    queryFn: VideosApi.getExplore,
  });

  return { exploreVideos, ...rest };
};

export const useGetVideo = (id: string) => {
  const { data: video, ...rest } = useQuery({
    queryKey: ["video", id],
    queryFn: () => VideosApi.findOne(id),
  });

  return { video, ...rest };
};

export const useUpdateVideo = () => {
  const { mutate: updateVideo, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateVideoDto }) =>
      VideosApi.update(payload.id, payload.dto),
  });

  return { updateVideo, ...rest };
};

export const useDeleteVideo = () => {
  const { mutate: deleteVideo, ...rest } = useMutation({
    mutationFn: (id: string) => VideosApi.delete(id),
  });

  return { deleteVideo, ...rest };
};
