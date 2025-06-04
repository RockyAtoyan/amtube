"use server";

import {
  CreatePlaylistDto,
  PlaylistsApi,
  ToggleSavePlaylistDto,
  ToggleVideoToPlaylistDto,
  UpdatePlaylistDto,
} from "./api";

export async function createPlaylist(dto: CreatePlaylistDto) {
  try {
    const res = await PlaylistsApi.create(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to create playlist");
  }
}

export async function findAllPlaylists(
  page: number,
  searchTerm?: string,
  filter?: "popular" | "latest" | "newest",
  limit?: number,
) {
  try {
    const res = await PlaylistsApi.findAll(page, searchTerm, filter, limit);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch playlists");
  }
}

export async function findPlaylistById(id: string) {
  try {
    const res = await PlaylistsApi.findById(id);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch playlist");
  }
}

export async function toggleSavePlaylist(
  id: string,
  dto: ToggleSavePlaylistDto,
) {
  try {
    const res = await PlaylistsApi.toggleSavePlaylist(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to toggle save playlist");
  }
}

export async function toggleVideoToPlaylist(
  id: string,
  dto: ToggleVideoToPlaylistDto,
) {
  try {
    const res = await PlaylistsApi.toggleVideoToPlaylist(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to toggle video in playlist");
  }
}

export async function updatePlaylist(id: string, dto: UpdatePlaylistDto) {
  try {
    const res = await PlaylistsApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update playlist");
  }
}

export async function deletePlaylist(id: string) {
  try {
    const res = await PlaylistsApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete playlist");
  }
}
