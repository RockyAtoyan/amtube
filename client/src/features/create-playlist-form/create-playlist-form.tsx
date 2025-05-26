"use client";

import { CreatePlaylistResponse } from "@/entities/playlist/api/api";
import { useCreatePlaylist } from "@/entities/playlist/api/hooks";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import { Loader } from "@/shared/ui/loader";
import Textarea from "@/shared/ui/textarea";

import { FC } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
  })
  .required();
type FormDataType = yup.InferType<typeof schema>;

interface Props {
  onSuccess?: (data: CreatePlaylistResponse) => void;
  loading?: boolean;
  isForChannel?: boolean;
}

const CreatePlaylistForm: FC<Props> = ({
  onSuccess,
  loading,
  isForChannel,
}) => {
  const { user, isPending: isAuthPending } = useAuthStore();

  const { createPlaylist, isPending } = useCreatePlaylist(onSuccess);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormDataType) => {
    if (!user || !user.channel?.id) {
      setError("root", { message: "Unauthorized" });
      return;
    }
    if (
      user?.playlists?.find((playlist) => playlist.title === "Watch later") &&
      data.title === "Watch later"
    ) {
      setError("root", {
        message: "You can not create playlist with this title!",
      });
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("userId", user.id);
    isForChannel && formData.append("channelId", user.channel.id);
    createPlaylist(formData);
    reset();
  };

  if (!user && isAuthPending) return <Loader />;
  if (!user && !isAuthPending) return <p>Have no access</p>;

  return (
    <div>
      <form
        className="flex flex-col gap-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          containerClassName="w-full"
          label="Title"
          error={errors.title?.message}
          {...register("title")}
        />

        <Textarea
          containerClassName="w-full"
          label="Description"
          error={errors.description?.message || errors.root?.message}
          {...register("description")}
        />

        <Button
          disabled={isPending}
          className="w-full mt-2 bg-accent hover:bg-accent/90"
          type="submit"
        >
          {isPending || loading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePlaylistForm;
