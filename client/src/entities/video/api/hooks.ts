import { useEffect } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { UpdateVideoDto, VideosApi } from "./api";

interface ProccessVideoDto {
  file: File;
  title: string;
  description: string;
  channelId: string;
}

export const useProcessVideoFile = () => {
  const { mutateAsync: processVideoFile, ...rest } = useMutation({
    mutationFn: async (data: ProccessVideoDto) => {
      try {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("channelId", data.channelId);

        const response = await VideosApi.processVideoFile(formData);
        return response;
      } catch (error) {
        toast.error("Failed to proccess video. Please try again!");
      }
    },
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

export const useGetTrendingVideosByPage = (page: number, limit?: number) => {
  const { data: trendingVideos, ...rest } = useQuery({
    queryKey: ["trending-videos", page, limit],
    queryFn: () => VideosApi.getTrending(page, limit),
  });

  return { trendingVideos, ...rest };
};

export const useGetTrendingVideos = () => {
  const { ref, inView } = useInView();
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["trending-videos"],
    queryFn: ({ pageParam }) => VideosApi.getTrending(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length;
    },
    initialPageParam: 0,
  });
  useEffect(() => {
    if (inView && rest.hasNextPage) {
      rest.fetchNextPage();
    }
  }, [inView]);

  return {
    trendingVideosPages: data?.pages || [],
    flagRef: ref,
    loading: rest.status === "pending",
    ...rest,
  };
};

export const useGetExploreVideos = () => {
  const { ref, inView } = useInView();
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["explore-videos"],
    queryFn: VideosApi.getExplore,
    getNextPageParam: (lastPage, allPages) => {
      return allPages.length;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && rest.hasNextPage) {
      rest.fetchNextPage();
    }
  }, [inView]);

  return {
    exploreVideosPages: data?.pages || [],
    flagRef: ref,
    loading: rest.status === "pending",
    ...rest,
  };
};

export const useGetVideo = (id: string) => {
  const { data: video, ...rest } = useQuery({
    queryKey: ["video", id],
    queryFn: () => VideosApi.findOne(id),
  });

  return { video, ...rest };
};

export const useFindSimilarVideos = (
  id: string,
  page: number,
  limit?: number,
) => {
  const { data: similarVideos, ...rest } = useQuery({
    queryKey: ["similar-videos", id, page, limit],
    queryFn: () => VideosApi.findSimilar(id, page, limit),
  });

  return { similarVideos, ...rest };
};

export const useUpdateVideo = () => {
  const { mutate: updateVideo, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateVideoDto }) =>
      VideosApi.update(payload.id, payload.dto),
    onError: () => {
      toast.error("An error occurred during uploading. Try again!");
    },
    onSuccess: () => {
      toast.success("Video updated successfully!");
    },
  });

  return { updateVideo, ...rest };
};

export const useDeleteVideo = () => {
  const { mutate: deleteVideo, ...rest } = useMutation({
    mutationFn: (id: string) => VideosApi.delete(id),
    onError: () => {
      toast.error("An error occurred during deleting. Try again!");
    },
  });

  return { deleteVideo, ...rest };
};
