"use server";

import {
  CommentsApi,
  type CreateCommentDto,
  type ToggleLikeCommentDto,
  type UpdateCommentDto,
} from "./api";

export async function createComment(dto: CreateCommentDto) {
  try {
    const res = await CommentsApi.create(dto);
    return res;
  } catch (error) {
    throw new Error("Failed to create comment");
  }
}

export async function findAllComments(videoId: string) {
  try {
    const res = await CommentsApi.findAll(videoId);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch comments");
  }
}

export async function findCommentById(id: string) {
  try {
    const res = await CommentsApi.findOne(id);
    return res;
  } catch (error) {
    throw new Error("Failed to fetch comment");
  }
}

export async function toggleLikeComment(id: string, dto: ToggleLikeCommentDto) {
  try {
    const res = await CommentsApi.toggleLike(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to toggle like comment");
  }
}

export async function updateComment(id: string, dto: UpdateCommentDto) {
  try {
    const res = await CommentsApi.update(id, dto);
    return res;
  } catch (error) {
    throw new Error("Failed to update comment");
  }
}

export async function deleteComment(id: string) {
  try {
    const res = await CommentsApi.delete(id);
    return res;
  } catch (error) {
    throw new Error("Failed to delete comment");
  }
}
