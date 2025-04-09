export class StudioRoutes {
  static readonly STUDIO_HOME = "/studio";
  static readonly VIDEO_UPLOAD = "/studio/upload";
  static readonly VIDEOS = "/studio/videos";
  static VIDEO(videoId: string) {
    return `/studio/videos/${videoId}`;
  }
  static readonly PLAYLISTS = "/studio/playlists";
  static PLAYLIST(playlistId: string) {
    return `/studio/playlists/${playlistId}`;
  }
  static readonly CHANNEL = "/studio/channel";
}
