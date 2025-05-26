import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Playlist } from "../model/playlist";
import {
  PlaylistsApi,
  ToggleSavePlaylistDto,
  ToggleVideoToPlaylistDto,
  UpdatePlaylistDto,
} from "./api";

export const useGetPlaylists = (
  page: number,
  searchTerm?: string,
  filter?: "popular" | "latest" | "newest",
  limit?: number,
) => {
  const { data: playlists, ...rest } = useQuery({
    queryKey: ["playlists", page, searchTerm, filter, limit],
    queryFn: () => PlaylistsApi.findAll(page, searchTerm, filter, limit),
  });

  return { playlists, ...rest };
};

export const useGetPlaylist = (id: string) => {
  const { data: playlist, ...rest } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => PlaylistsApi.findById(id),
  });

  return { playlist, ...rest };
};

export const useCreatePlaylist = (onSuccess?: Function) => {
  const queryClient = useQueryClient();

  const { mutate: createPlaylist, ...rest } = useMutation({
    mutationFn: PlaylistsApi.create,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["channel", data?.channel?.slug],
      });
      !onSuccess && toast.success(`Created playlist "${data.title}"!`);
      onSuccess?.(data);
    },
    onError(error) {},
  });

  return { createPlaylist, ...rest };
};

export const useToggleSavePlaylist = () => {
  const { mutate: toggleSavePlaylist, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: ToggleSavePlaylistDto }) =>
      PlaylistsApi.toggleSavePlaylist(payload.id, payload.dto),
  });

  return { toggleSavePlaylist, ...rest };
};

export const useToggleVideoToPlaylist = (
  onSuccess?: (data: Playlist) => void,
) => {
  const queryClient = useQueryClient();

  const { mutate: toggleVideoToPlaylist, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: ToggleVideoToPlaylistDto }) =>
      PlaylistsApi.toggleVideoToPlaylist(payload.id, payload.dto),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["trending-videos"],
      });
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({ queryKey: ["playlist", data.id] });
      onSuccess?.(data);
    },
  });

  return { toggleVideoToPlaylist, ...rest };
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();

  const { mutate: updatePlaylist, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdatePlaylistDto }) =>
      PlaylistsApi.update(payload.id, payload.dto),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["channel", data?.channel?.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["playlist", data.id] });
    },
  });

  return { updatePlaylist, ...rest };
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  const { mutate: deletePlaylist, ...rest } = useMutation({
    mutationFn: (id: string) => PlaylistsApi.delete(id),
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["channel", data?.channel?.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["playlist", data.id] });
    },
  });

  return { deletePlaylist, ...rest };
};
