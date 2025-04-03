import { Channel } from "@/entities/channel/model/channel";
import { User } from "@/entities/user/model/user";
import { Video } from "@/entities/video/model/video";

import { Playlist } from "./playlist";

export interface PlaylistWithRelations extends Playlist {
  user?: User;
  channel?: Channel;
  videos: Video[];
  savings: User[];
}
