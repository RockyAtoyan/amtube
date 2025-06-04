import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Playlist } from "../model/playlist";
import { PlaylistWithRelations } from "../model/playlist-with-relations";

export interface CreatePlaylistDto extends FormData {}
export interface CreatePlaylistResponse extends Playlist {}

export interface UpdatePlaylistDto extends Partial<CreatePlaylistDto> {}
export type UpdatePlaylistResponse = Playlist;

export type FindAllPlaylistResponse = {
  playlists: PlaylistWithRelations[];
  totalCount: number;
};

export type FindOnePlaylistResponse = PlaylistWithRelations;

export interface ToggleSavePlaylistDto {
  playlistId: string;
  userId: string;
  isSaved: boolean;
}
export type ToggleSavePlaylistResponse = Playlist;

export interface ToggleVideoToPlaylistDto {
  playlistId: string;
  videoId: string;
  isAdded: boolean;
}
export type ToggleVideoToPlaylistResponse = Playlist;

export class PlaylistsApi {
  static async create(dto: CreatePlaylistDto) {
    const res = await authInstance.post<CreatePlaylistResponse>(
      ROUTES.playlists.create.path,
      dto,
    );
    return res.data;
  }

  static async findAll(
    page: number,
    searchTerm?: string,
    filter?: "popular" | "latest" | "newest",
    limit?: number,
  ) {
    const res = await publicInstance.get<FindAllPlaylistResponse>(
      ROUTES.playlists.findAll.path,
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

  static async findById(id: string) {
    const res = await publicInstance.get<FindOnePlaylistResponse>(
      ROUTES.playlists.findOne.path + "/" + id,
    );
    return res.data;
  }

  static async toggleSavePlaylist(id: string, dto: ToggleSavePlaylistDto) {
    const res = await authInstance.patch<ToggleSavePlaylistResponse>(
      ROUTES.playlists.toggleSavePlaylist.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async toggleVideoToPlaylist(
    id: string,
    dto: ToggleVideoToPlaylistDto,
  ) {
    const res = await authInstance.patch<ToggleVideoToPlaylistResponse>(
      ROUTES.playlists.toggleVideoToPlaylist.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async update(id: string, dto: UpdatePlaylistDto) {
    const res = await authInstance.patch<UpdatePlaylistResponse>(
      ROUTES.playlists.update.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdatePlaylistResponse>(
      ROUTES.playlists.delete.path + "/" + id,
    );
    return res.data;
  }
}
