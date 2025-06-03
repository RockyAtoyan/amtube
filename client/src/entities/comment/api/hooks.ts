import toast from "react-hot-toast";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CommentWithRelations } from "../model/comment-with-relations";
import { CommentsApi, ToggleLikeCommentDto, UpdateCommentDto } from "./api";

export const useGetComments = (
  videoId: string,
  initComments?: CommentWithRelations[],
) => {
  const { data: comments, ...rest } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => CommentsApi.findAll(videoId),
    initialData: initComments,
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
  const queryClient = useQueryClient();

  const { mutate: createComment, ...rest } = useMutation({
    mutationFn: CommentsApi.create,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["comments", data.video.id],
      });
      toast.success(`Created comment!`);
    },
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
  const queryClient = useQueryClient();

  const { mutate: updateComment, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateCommentDto }) =>
      CommentsApi.update(payload.id, payload.dto),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["comments", data.video.id],
      });
    },
  });

  return { updateComment, ...rest };
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteComment, ...rest } = useMutation({
    mutationFn: ({id, authId}:{id: string, authId: string}) => CommentsApi.delete(id, authId),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({
        //@ts-ignore
        queryKey: ["comments", data.video.id],
      });
    },
  });

  return { deleteComment, ...rest };
};
