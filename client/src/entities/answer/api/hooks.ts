import { useMutation, useQuery } from "@tanstack/react-query";

import { AnswersApi, ToggleLikeAnswerDto, UpdateAnswerDto } from "./api";

export const useGetAnswers = () => {
  const { data: answers, ...rest } = useQuery({
    queryKey: ["answers"],
    queryFn: AnswersApi.findAll,
  });

  return { answers, ...rest };
};

export const useGetAnswer = (id: string) => {
  const { data: answer, ...rest } = useQuery({
    queryKey: ["answer", id],
    queryFn: () => AnswersApi.findOne(id),
  });

  return { answer, ...rest };
};

export const useCreateAnswer = () => {
  const { mutate: createAnswer, ...rest } = useMutation({
    mutationFn: AnswersApi.create,
  });

  return { createAnswer, ...rest };
};

export const useToggleLikeAnswer = () => {
  const { mutate: toggleLikeAnswer, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: ToggleLikeAnswerDto }) =>
      AnswersApi.toggleLike(payload.id, payload.dto),
  });

  return { toggleLikeAnswer, ...rest };
};

export const useUpdateAnswer = () => {
  const { mutate: updateAnswer, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateAnswerDto }) =>
      AnswersApi.update(payload.id, payload.dto),
  });

  return { updateAnswer, ...rest };
};

export const useDeleteAnswer = () => {
  const { mutate: deleteAnswer, ...rest } = useMutation({
    mutationFn: AnswersApi.delete,
  });

  return { deleteAnswer, ...rest };
};
