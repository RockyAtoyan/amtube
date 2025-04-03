import { Playlist } from "@/entities/playlist/model/playlist";
import { User } from "@/entities/user/model/user";
import { Video } from "@/entities/video/model/video";

import { Channel } from "./channel";

export interface ChannelWithRelations extends Channel {
  user: User;
  videos: Video[];
  subscribers: User[];
  playlists: Playlist[];
}
