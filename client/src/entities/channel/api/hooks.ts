import { useMutation, useQuery } from "@tanstack/react-query";

import { ChannelsApi, UpdateChannelDto } from "./api";

export const useGetChannels = (
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

export const useCreateChannel = () => {
  const { mutate: createChannel, ...rest } = useMutation({
    mutationFn: ChannelsApi.create,
  });

  return { createChannel, ...rest };
};

export const useUpdateChannel = () => {
  const { mutate: updateChannel, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateChannelDto }) =>
      ChannelsApi.update(payload.id, payload.dto),
  });

  return { updateChannel, ...rest };
};

export const useDeleteChannel = () => {
  const { mutate: deleteChannel, ...rest } = useMutation({
    mutationFn: (id: string) => ChannelsApi.delete(id),
  });

  return { deleteChannel, ...rest };
};
