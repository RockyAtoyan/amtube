import { useMutation, useQuery } from "@tanstack/react-query";

import {
  AddVideoToHistoryDto,
  BanUserDto,
  UpdateUserDto,
  UsersApi,
} from "./api";

export const useSignUp = () => {
  const { mutate: signUp, ...rest } = useMutation({
    mutationFn: UsersApi.signUp,
  });

  return { signUp, ...rest };
};

export const useSignIn = () => {
  const { mutate: signIn, ...rest } = useMutation({
    mutationFn: UsersApi.signIn,
  });

  return { signIn, ...rest };
};

export const useLogout = () => {
  const { mutate: logout, ...rest } = useMutation({
    mutationFn: UsersApi.logout,
  });

  return { logout, ...rest };
};

export const useSendActivateEmail = () => {
  const { mutate: sendActivateEmail, ...rest } = useMutation({
    mutationFn: (userId: string) => UsersApi.sendActivateEmail(userId),
  });

  return { sendActivateEmail, ...rest };
};

export const useRefreshAccessToken = () => {
  const { data: accessToken, ...rest } = useQuery({
    queryKey: ["refresh-access-token"],
    queryFn: UsersApi.refreshAccessToken,
  });

  return { accessToken, ...rest };
};

export const useGetUser = (id: string) => {
  const { data: user, ...rest } = useQuery({
    queryKey: ["user", id],
    queryFn: () => UsersApi.findById(id),
  });

  return { user, ...rest };
};

export const useGetUserByEmail = (email: string) => {
  const { data: user, ...rest } = useQuery({
    queryKey: ["user", email],
    queryFn: () => UsersApi.findByEmail(email),
  });

  return { user, ...rest };
};

export const useGetUserBySlug = (slug: string) => {
  const { data: user, ...rest } = useQuery({
    queryKey: ["user", slug],
    queryFn: () => UsersApi.findBySlug(slug),
  });

  return { user, ...rest };
};

export const useUpdateUser = () => {
  const { mutate: updateUser, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: UpdateUserDto }) =>
      UsersApi.update(payload.id, payload.dto),
  });

  return { updateUser, ...rest };
};

export const useBanUser = () => {
  const { mutate: banUser, ...rest } = useMutation({
    mutationFn: (payload: { id: string; dto: BanUserDto }) =>
      UsersApi.banUser(payload.id, payload.dto),
  });

  return { banUser, ...rest };
};

export const useAddVideoToHistory = () => {
  const { mutate: addVideoToHistory, ...rest } = useMutation({
    mutationFn: (dto: AddVideoToHistoryDto) => UsersApi.addVideoToHistory(dto),
  });

  return { addVideoToHistory, ...rest };
};

export const useToggleChannelSubscribe = () => {
  const { mutate: toggleChannelSubscribe, ...rest } = useMutation({
    mutationFn: UsersApi.toggleChannelSubscribe,
  });

  return { toggleChannelSubscribe, ...rest };
};

export const useGetUserHistory = () => {
  const { data: history, ...rest } = useQuery({
    queryKey: ["user-history"],
    queryFn: UsersApi.getUserHistory,
  });

  return { history, ...rest };
};

export const useGetUserSubscribesVideos = () => {
  const { data: subscribesVideos, ...rest } = useQuery({
    queryKey: ["user-subscribes-videos"],
    queryFn: UsersApi.getUserSubscribesVideos,
  });

  return { subscribesVideos, ...rest };
};
