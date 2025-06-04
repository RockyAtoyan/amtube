import { Comment } from "@/entities/comment/model/comment";
import { User } from "@/entities/user/model/user";

import { Answer } from "./answer";

export interface AnswerWithRelations extends Answer {
  likes: User[];
  dislikes: User[];
  comment: Comment;
  user: User;
  to: User;
}
