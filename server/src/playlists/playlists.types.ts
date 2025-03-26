export enum PlaylistFilterEnum {
  POPULAR = 'popular',
  LATEST = 'latest',
  NEWEST = 'newest',
}

export type PlaylistFilter = PlaylistFilterEnum;

export interface ToggleSavePlaylistDto {
  playlistId: string;
  userId: string;
  isSaved: boolean;
}

export interface ToggleVideoToPlaylistDto {
  playlistId: string;
  videoId: string;
  isAdded: boolean;
}
