"use client";

import {
  useGetPlaylist,
  useUpdatePlaylist,
} from "@/entities/playlist/api/hooks";
import { useUploadMedia } from "@/shared/lib/hooks/useUploadMedia";
import { useAuthStore } from "@/shared/store/auth.store";
import { Button } from "@/shared/ui/button";
import Input from "@/shared/ui/input";
import { Loader } from "@/shared/ui/loader";
import Textarea from "@/shared/ui/textarea";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import PlaylistEditThumbnail from "./playlist-edit-thumbnail";
import PlaylistEditVideos from "./playlist-edit-videos";

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
  })
  .required();
type FormDataType = yup.InferType<typeof schema>;

interface Props {
  playlistId: string;
}

const PlaylistEditForm: FC<Props> = ({ playlistId }) => {
  const { user, isPending } = useAuthStore();

  const { uploadMedia, isMediaUploading } = useUploadMedia();
  const { playlist, isLoading } = useGetPlaylist(playlistId);
  const { updatePlaylist, isPending: isUpdatePending } = useUpdatePlaylist();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const initLoading = isPending || isLoading || !user || !playlist;
  const uploadingLoading = isMediaUploading || isUpdatePending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: playlist?.title || "",
      description: playlist?.description || "",
    },
  });

  useEffect(() => {
    if (playlist) {
      reset({
        title: playlist?.title || "",
        description: playlist?.description || "",
      });
    }
  }, [playlist]);

  const onSubmit = async (data: FormDataType) => {
    if (!user || !playlist) return;
    try {
      const thumbnailUrl =
        thumbnailFile &&
        (await uploadMedia({
          uploadPath: "/playlists-thumbnails",
          filename: playlist.id,
          file: thumbnailFile,
        }));
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("userId", user.id);
      thumbnailUrl && formData.append("thumbnailUrl", thumbnailUrl);
      await updatePlaylist(
        {
          id: playlist.id,
          dto: formData,
        },
        {
          onSuccess(data, variables, context) {
            toast.success("Published!");
            setThumbnailFile(null);
          },
        },
      );
    } catch (error) {
      toast.error("An error occurred during uploading thumbnail. Try again!");
    }
  };

  if (initLoading) {
    return <Loader className="h-full" />;
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full flex items-center justify-between gap-5 py-3 border-b border-border">
          <h2 className="text-xl">Playlist Edit</h2>
          <div className="flex items-center gap-5">
            <Button
              type="button"
              disabled={uploadingLoading}
              variant={"outline"}
              onClick={() => {
                reset({
                  title: playlist?.title || "",
                  description: playlist?.description || "",
                });
                setThumbnailFile(null);
                toast.success("Canceled!");
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploadingLoading}>
              Publish
            </Button>
          </div>
        </div>
        <div className="mt-5">
          <PlaylistEditThumbnail
            playlist={playlist}
            thumbnailFile={thumbnailFile}
            setThumbnailFile={setThumbnailFile}
          />
        </div>
        <div className="space-y-6 mt-5">
          <div className="mt-5">
            <p className="text-lg">Playlist's Title</p>
            <p className="text-sm text-primary/70 mb-5">
              Come up with a title that represents playlist's content.
            </p>
            <Input
              label="Title"
              error={errors.title?.message}
              {...register("title")}
            />
            {errors.title?.message && (
              <p className="mt-2 text-sm text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mt-5">
            <p className="text-lg mb-5">Playlist's Description</p>
            <Textarea
              label="Description"
              error={errors.description?.message || errors.root?.message}
              {...register("description")}
            />

            {errors.description?.message && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </form>
      <PlaylistEditVideos playlist={playlist} />
    </div>
  );
};

export default PlaylistEditForm;
