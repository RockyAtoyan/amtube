import { authInstance, publicInstance } from "@/shared/api/axios";
import { ROUTES } from "@/shared/api/routes";

import { Comment } from "../model/comment";
import { CommentWithRelations } from "../model/comment-with-relations";

export interface CreateCommentDto {
  text: string;
  userId: string;
  videoId: string;
}
export interface CreateCommentResponse extends Comment {}

export interface UpdateCommentDto extends Partial<CreateCommentDto> {
  userId: string;
}
export type UpdateCommentResponse = Comment;

export type FindAllCommentResponse = CommentWithRelations[];

export type FindOneCommentResponse = CommentWithRelations;

export interface ToggleLikeCommentDto {
  userId: string;
  commentId: string;
  isLiked: boolean;
}

export type ToggleLikeCommentResponse = Comment;

export class CommentsApi {
  static async create(dto: CreateCommentDto) {
    const res = await authInstance.post<CreateCommentResponse>(
      ROUTES.comments.create.path,
      dto,
    );
    return res.data;
  }

  static async findAll(videoId: string) {
    const res = await publicInstance.get<FindAllCommentResponse>(
      ROUTES.comments.findAll.path + "/" + videoId,
    );
    return res.data;
  }

  static async findOne(id: string) {
    const res = await publicInstance.get<FindOneCommentResponse>(
      ROUTES.comments.findOne.path + "/" + id,
    );
    return res.data;
  }

  static async toggleLike(id: string, dto: ToggleLikeCommentDto) {
    const res = await authInstance.patch<ToggleLikeCommentResponse>(
      ROUTES.comments.toggleLike.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async update(id: string, dto: UpdateCommentDto) {
    const res = await authInstance.patch<UpdateCommentResponse>(
      ROUTES.comments.update.path + "/" + id,
      dto,
    );
    return res.data;
  }

  static async delete(id: string) {
    const res = await authInstance.delete<UpdateCommentResponse>(
      ROUTES.comments.delete.path + "/" + id,
    );
    return res.data;
  }
}
