import { SearchVideoFilter } from "@/shared/lib/types/videos.types";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ToggleLikeVideoDto, UpdateVideoDto, VideosApi } from "./api";

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

export const useGetVideosByPage = (
  page: number,
  searchTerm?: string,
  filter?: SearchVideoFilter,
  limit?: number,
) => {
  const { data: videos, ...rest } = useQuery({
    queryKey: ["videos", page, searchTerm, filter, limit],
    queryFn: () => VideosApi.findAll(page, searchTerm, filter, limit),
  });

  return { videos, ...rest };
};

export const useGetVideos = (
  searchTerm?: string,
  filter?: SearchVideoFilter,
) => {
  const { ref, inView } = useInView();
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["videos", searchTerm],
    queryFn: ({ pageParam }) =>
      VideosApi.findAll(pageParam, searchTerm, filter, 10),
    getNextPageParam: (lastPage, allPages) => {
      return Math.ceil(lastPage.totalCount / 10) <= allPages.length
        ? null
        : allPages.length;
    },
    initialPageParam: 0,
  });
  useEffect(() => {
    if (inView && rest.hasNextPage) {
      rest.fetchNextPage();
    }
  }, [inView]);

  return {
    videosPages: data?.pages || [],
    flagRef: ref,
    loading: rest.status === "pending",
    ...rest,
  };
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

export const useGetVideoByPublicId = (publicId: string) => {
  const { data: video, ...rest } = useQuery({
    queryKey: ["video", publicId],
    queryFn: () => VideosApi.findByPublicId(publicId),
  });

  return { video, ...rest };
};

export const useFindSimilarVideos = (id: string) => {
  const { ref, inView } = useInView();
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["similar-videos", id],
    queryFn: ({ pageParam }) => VideosApi.findSimilar(id, pageParam, 5),
    getNextPageParam: (lastPage, allPages) => {
      return !lastPage.hasMore ? null : allPages.length;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && rest.hasNextPage) {
      rest.fetchNextPage();
    }
  }, [inView]);

  return {
    similarVideosPages: data?.pages || [],
    flagRef: ref,
    loading: rest.status === "pending",
    ...rest,
  };
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  const { mutate: updateVideo, ...rest } = useMutation({
    mutationFn: (payload: {
      id: string;
      dto: UpdateVideoDto;
      isUploading?: boolean;
    }) => VideosApi.update(payload.id, payload.dto, payload.isUploading),
    onError: () => {
      toast.error("An error occurred during uploading. Try again!");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["channel", data?.channel?.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["video", data.id] });
    },
  });

  return { updateVideo, ...rest };
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  const { mutate: toggleLikeVideo, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: ToggleLikeVideoDto }) =>
      VideosApi.toggleLike(payload.id, payload.dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({ queryKey: ["video", data.id] });
      queryClient.invalidateQueries({ queryKey: ["video", data.publicId] });
      queryClient.invalidateQueries({ queryKey: ["user-liked-videos"] });
    },
  });

  return { toggleLikeVideo, ...rest };
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteVideo, ...rest } = useMutation({
    mutationFn: (id: string) => VideosApi.delete(id),
    onError: () => {
      toast.error("An error occurred during deleting. Try again!");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["channel", data?.channel?.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["video", data.id] });
    },
  });

  return { deleteVideo, ...rest };
};
