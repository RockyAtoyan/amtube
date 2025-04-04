import { useMutation, useQuery } from "@tanstack/react-query";

import { CommentsApi, ToggleLikeCommentDto, UpdateCommentDto } from "./api";

export const useGetComments = (videoId: string) => {
  const { data: comments, ...rest } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => CommentsApi.findAll(videoId),
  });

  return { comments, ...rest };
};

export const useGetComment = (id: string) => {
  const { data: comment, ...rest } = useQuery({
    queryKey: ["comment", id],
    queryFn: () => CommentsApi.findOne(id),
  });

  return { comment, ...rest };
};

export const useCreateComment = () => {
  const { mutate: createComment, ...rest } = useMutation({
    mutationFn: CommentsApi.create,
  });

  return { createComment, ...rest };
};

export const useToggleLikeComment = () => {
  const { mutate: toggleLikeComment, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: ToggleLikeCommentDto }) =>
      CommentsApi.toggleLike(payload.id, payload.dto),
  });

  return { toggleLikeComment, ...rest };
};

export const useUpdateComment = () => {
  const { mutate: updateComment, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateCommentDto }) =>
      CommentsApi.update(payload.id, payload.dto),
  });

  return { updateComment, ...rest };
};

export const useDeleteComment = () => {
  const { mutate: deleteComment, ...rest } = useMutation({
    mutationFn: (id: string) => CommentsApi.delete(id),
  });

  return { deleteComment, ...rest };
};
