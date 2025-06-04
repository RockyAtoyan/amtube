import { useMutation, useQueryClient } from "@tanstack/react-query";

import { NotificationsApi, UpdateNotificationDto } from "./api";

export const useCreateNotification = () => {
  const { mutate: createNotification, ...rest } = useMutation({
    mutationFn: NotificationsApi.create,
  });

  return { createNotification, ...rest };
};

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();

  const { mutate: updateNotification, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateNotificationDto }) =>
      NotificationsApi.update(payload.id, payload.dto),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return { updateNotification, ...rest };
};

export const useDeleteNotification = () => {
  const { mutate: deleteNotification, ...rest } = useMutation({
    mutationFn: (id: string) => NotificationsApi.delete(id),
  });

  return { deleteNotification, ...rest };
};
