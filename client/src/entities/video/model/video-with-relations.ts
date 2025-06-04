import { Channel } from "@/entities/channel/model/channel";
import { CommentWithRelations } from "@/entities/comment/model/comment-with-relations";
import { Playlist } from "@/entities/playlist/model/playlist";
import { Tag } from "@/entities/tag/model/tag";
import { History } from "@/entities/user/model/history";
import { User } from "@/entities/user/model/user";

import { Resolution } from "./resolution";
import { Video } from "./video";

export interface VideoWithRelations extends Video {
  channel: Channel;
  playlists: Playlist[];
  views: History[];
  likes: User[];
  dislikes: User[];
  comments: CommentWithRelations[];
  resolutions: Resolution[];
  tags: Tag[];
}
