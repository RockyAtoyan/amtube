import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ChannelsApi, UpdateChannelDto } from "./api";

export const useGetChannelsByPage = (
  page: number,
  searchTerm?: string,
  filter?: "popular" | "alphabet" | "alphabet(desc)",
  limit?: number,
) => {
  const { data: channels, ...rest } = useQuery({
    queryKey: ["channels", page, searchTerm, filter, limit],
    queryFn: () => ChannelsApi.findAll(page, searchTerm, filter, limit),
  });

  return { channels, ...rest };
};

export const useGetChannels = (
  searchTerm?: string,
  filter?: "popular" | "alphabet" | "alphabet(desc)",
) => {
  const { ref, inView } = useInView();
  const { data, ...rest } = useInfiniteQuery({
    queryKey: ["videos", searchTerm],
    queryFn: ({ pageParam }) =>
      ChannelsApi.findAll(pageParam, searchTerm, filter, 10),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.totalCount / 10 === allPages.length
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
    channelsPages: data?.pages || [],
    flagRef: ref,
    loading: rest.status === "pending",
    ...rest,
  };
};

export const useGetChannel = (id: string) => {
  const { data: channel, ...rest } = useQuery({
    queryKey: ["channel", id],
    queryFn: () => ChannelsApi.findById(id),
  });

  return { channel, ...rest };
};

export const useGetChannelBySlug = (slug: string) => {
  const { data: channel, ...rest } = useQuery({
    queryKey: ["channel", slug],
    queryFn: () => ChannelsApi.findBySlug(slug),
  });

  return { channel, ...rest };
};

export const useCreateChannel = (onSuccess?: Function) => {
  const queryClient = useQueryClient();

  const { mutate: createChannel, ...rest } = useMutation({
    mutationFn: ChannelsApi.create,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      onSuccess?.(data);
    },
  });

  return { createChannel, ...rest };
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();

  const { mutate: updateChannel, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateChannelDto }) =>
      ChannelsApi.update(payload.id, payload.dto),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { updateChannel, ...rest };
};

export const useDeleteChannel = () => {
  const { mutate: deleteChannel, ...rest } = useMutation({
    mutationFn: (id: string) => ChannelsApi.delete(id),
  });

  return { deleteChannel, ...rest };
};
