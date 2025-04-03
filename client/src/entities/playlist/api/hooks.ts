import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useCreatePlaylist = () => {
  const { mutate: createPlaylist, ...rest } = useMutation({
    mutationFn: PlaylistsApi.create,
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

export const useToggleVideoToPlaylist = () => {
  const { mutate: toggleVideoToPlaylist, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: ToggleVideoToPlaylistDto }) =>
      PlaylistsApi.toggleVideoToPlaylist(payload.id, payload.dto),
  });

  return { toggleVideoToPlaylist, ...rest };
};

export const useUpdatePlaylist = () => {
  const { mutate: updatePlaylist, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdatePlaylistDto }) =>
      PlaylistsApi.update(payload.id, payload.dto),
  });

  return { updatePlaylist, ...rest };
};

export const useDeletePlaylist = () => {
  const { mutate: deletePlaylist, ...rest } = useMutation({
    mutationFn: (id: string) => PlaylistsApi.delete(id),
  });

  return { deletePlaylist, ...rest };
};
