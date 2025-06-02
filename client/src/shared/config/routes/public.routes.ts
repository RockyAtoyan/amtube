import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";

export class PublicRoutes {
  static readonly HOME = "/";
  static readonly TRENDING = "/trending";
  static readonly SUBSCRIPTIONS = "/subscriptions";

  static readonly LIBRARY = "/library";
  static readonly HISTORY = "/history";
  static readonly WATCH_LATER = "/watch-later";
  static readonly LIKES = "/liked";
  static readonly PLAYLISTS = "/playlists";
  static readonly SEND_FEEDBACK = "/feedback";

  static CHANNEL(slug: string) {
    return `/c/${slug}`;
  }

  static VIDEO(publicId: string, playlistId?: string) {
    return `/v/${publicId}` + (playlistId ? `?list=${playlistId}` : "");
  }

  static PLAYLIST(playlist: PlaylistWithRelations) {
    const videoId = playlist?.videos[0]?.publicId;
    if (!videoId) return this.HOME;
    return this.VIDEO(videoId, playlist.id);
  }

  static readonly SIGN_IN = "/sign-in";
  static readonly SIGN_UP = "/sign-up";
  static readonly FORGOT_PASSWORD = "/forgot-password";

  static readonly TERMS_OF_SERVICE = "/terms-of-service";
  static readonly PRIVACY_POLICY = "/privacy-policy";
}
