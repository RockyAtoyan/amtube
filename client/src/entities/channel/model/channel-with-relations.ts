import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import { User } from "@/entities/user/model/user";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";

import { Channel } from "./channel";

export interface ChannelWithRelations extends Channel {
  user: User;
  videos: VideoWithRelations[];
  subscribers: User[];
  playlists: PlaylistWithRelations[];
}
