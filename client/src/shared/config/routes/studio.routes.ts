export class StudioRoutes {
  static readonly STUDIO_HOME = "/studio";
  static readonly VIDEO_UPLOAD = "/studio/upload";
  static readonly VIDEOS = "/studio/videos";
  static VIDEO(videoId: string) {
    return `/studio/videos/${videoId}`;
  }
  static readonly PLAYLISTS = "/studio/playlists";
  static readonly CREATE_PLAYLIST = this.PLAYLISTS + "/create";

  static PLAYLIST(playlistId: string) {
    return this.PLAYLISTS + `/${playlistId}`;
  }
  static EDIT_PLAYLIST(playlistId: string) {
    return this.PLAYLIST(playlistId) + "/edit";
  }
  static readonly CHANNEL = "/studio/channel";
  static readonly PROFILE = "/studio/profile";
}
