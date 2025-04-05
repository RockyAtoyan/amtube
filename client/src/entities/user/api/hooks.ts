import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { useAuthStore } from "@/shared/store/auth.store";

import { useEffect } from "react";
import toast from "react-hot-toast";

import { useMutation, useQuery } from "@tanstack/react-query";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import {
  AddVideoToHistoryDto,
  BanUserDto,
  UpdateUserDto,
  UsersApi,
} from "./api";

export const useSignUp = () => {
  const router = useRouter();

  const { mutate: signUp, ...rest } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: UsersApi.signUp,
    onSuccess: (data) => {
      toast.success("Account created successfully!");
      router.push(PublicRoutes.SIGN_IN);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          toast.error("Something went wrong, try again!");
          return;
        }
        const message =
          error.response?.data.message || "Something went wrong, try again!";
        toast.error(message);
      }
    },
  });

  return { signUp, ...rest };
};

export const useSignIn = (from?: string) => {
  const router = useRouter();

  const { setUser } = useAuthStore();

  const { mutate: signIn, ...rest } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: UsersApi.signIn,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Signed in successfully!");
      router.push(from || PublicRoutes.HOME);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          toast.error("Something went wrong, try again!");
          return;
        }
        const message =
          error.response?.data.message || "Something went wrong, try again!";
        toast.error(message);
      }
    },
  });

  return { signIn, ...rest };
};

export const useGetProfile = () => {
  const { setUser, setIsPending } = useAuthStore();

  const {
    data: profile,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: ["profile"],
    queryFn: UsersApi.getProfile,
    retry: false,
  });

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (!isLoading) setIsPending(false);
  }, [isLoading]);

  return { profile, ...rest };
};

export const useLogout = () => {
  const router = useRouter();

  const { logout: logoutFromStore } = useAuthStore();

  const { mutate: logout, ...rest } = useMutation({
    mutationKey: ["logout"],
    mutationFn: UsersApi.logout,
    onSuccess: (data) => {
      logoutFromStore();
      toast.success("Logged out successfully!");
      router.push(PublicRoutes.HOME);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status === 404) {
          toast.error("Something went wrong, try again!");
          return;
        }
        const message =
          error.response?.data.message || "Something went wrong, try again!";
        toast.error(message);
      }
    },
  });

  return { logout, ...rest };
};

export const useSendActivateEmail = () => {
  const { mutate: sendActivateEmail, ...rest } = useMutation({
    mutationFn: (userId: string) => UsersApi.sendActivateEmail(userId),
  });

  return { sendActivateEmail, ...rest };
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
