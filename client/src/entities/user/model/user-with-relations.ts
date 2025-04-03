import { Answer } from "@/entities/answer/model/answer";
import { Channel } from "@/entities/channel/model/channel";
import { Playlist } from "@/entities/playlist/model/playlist";
import { Video } from "@/entities/video/model/video";

import { History } from "./history";
import { User } from "./user";

export interface UserWithRelations extends User {
  channel?: Channel;
  likedVideos: Video[];
  dislikedVideos: Video[];
  history: History[];
  playlists: Playlist[];
  savedPlaylists: Playlist[];
  subscribes: Channel[];
  comments: Comment[];
  sendedAnswers: Answer[];
  recievedAnswers: Answer[];
  likedComments: Comment[];
  dislikedComments: Comment[];
  likedAnswers: Answer[];
  dislikedAnswers: Answer[];
  notifications: Notification[];
}
