import { Channel } from "@/entities/channel/model/channel";
import { User } from "@/entities/user/model/user";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";

import { Playlist } from "./playlist";

export interface PlaylistWithRelations extends Playlist {
  user?: User;
  channel?: Channel;
  videos: VideoWithRelations[];
  savings: User[];
}
