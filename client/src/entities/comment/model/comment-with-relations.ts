import { Answer } from "@/entities/answer/model/answer";
import { User } from "@/entities/user/model/user";
import { Video } from "@/entities/video/model/video";

import { Comment } from "./comment";

export interface CommentWithRelations extends Comment {
  likes: User[];
  dislikes: User[];
  answers: Answer[];
  user: User;
  video: Video;
}
