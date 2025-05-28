"use client";

import {
  useDeleteVideo,
  useGetVideo,
  useUpdateVideo,
} from "@/entities/video/api/hooks";
import VideoTagsInput from "@/features/video-tags-input/video-tags-input";
import { PublicRoutes } from "@/shared/config/routes/public.routes";
import { StudioRoutes } from "@/shared/config/routes/studio.routes";
import { useUploadMedia } from "@/shared/lib/hooks/useUploadMedia";
import { useAuthStore } from "@/shared/store/auth.store";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import HtmlEditor from "@/shared/ui/html-editor/html-editor";
import Input from "@/shared/ui/input";
import { Loader } from "@/shared/ui/loader";
import { Modal } from "@/shared/ui/modal";

import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { yupResolver } from "@hookform/resolvers/yup";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as yup from "yup";

import VideoEditThumbnail from "./video-edit-thumbnail";

const schema = yup
  .object({
    title: yup.string().required(),
    description: yup.string().required(),
  })
  .required();
type FormDataType = yup.InferType<typeof schema>;

interface Props {
  videoId: string;
}

const VideoEditForm: FC<Props> = ({ videoId }) => {
  const router = useRouter();

  const { user, isPending } = useAuthStore();

  const { uploadMedia, isMediaUploading } = useUploadMedia();
  const { video, isLoading } = useGetVideo(videoId);
  const { updateVideo, isPending: isUpdatePending } = useUpdateVideo();
  const { deleteVideo, isPending: isDeletePending } = useDeleteVideo();

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(
    video?.tags?.map((tag) => tag.name) || [],
  );

  const [isDeletingOpen, setIsDeletingOpen] = useState(false);

  const initLoading = isPending || isLoading || !user || !video;
  const uploadingLoading =
    isMediaUploading || isUpdatePending || isDeletePending;

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
      title: video?.title || "",
      description: video?.description || "",
    },
  });

  useEffect(() => {
    if (video) {
      reset({
        title: video?.title || "",
        description: video?.description || "",
      });
      setTags(video?.tags?.map((tag) => tag.name) || []);
    }
  }, [video]);

  const onSubmit = async (data: FormDataType) => {
    if (!video || !user) return;
    try {
      const thumbnailUrl =
        thumbnailFile &&
        (await uploadMedia({
          uploadPath: "/videos-thumbnails",
          filename: video.id,
          file: thumbnailFile,
        }));

      await updateVideo(
        {
          id: video.id,
          dto: {
            title: data.title,
            description: data.description,
            thumbnailUrl: thumbnailUrl || undefined,
            tags,
          },
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full flex items-center justify-between gap-5 py-3 border-b border-border">
        <h2 className="text-xl">Video Edit</h2>
        <div className="flex items-center gap-5">
          <Button
            type="button"
            disabled={uploadingLoading}
            variant="ghost"
            asChild
          >
            <Link href={PublicRoutes.VIDEO(video.publicId)}>
              Move to video page
            </Link>
          </Button>
          <Button
            type="button"
            disabled={uploadingLoading}
            variant={"outline"}
            onClick={() => {
              reset({
                title: video?.title || "",
                description: video?.description || "",
              });
              setTags(video?.tags?.map((tag) => tag.name) || []);
              setThumbnailFile(null);
              toast.success("Canceled!");
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={uploadingLoading}>
            Publish
          </Button>
          <div className="w-[2px] h-10 bg-border"></div>
          <Modal
            isOpen={isDeletingOpen}
            onOpenChange={(value) => setIsDeletingOpen(value)}
          >
            <Modal.Trigger asChild>
              <Button type="button" variant={"destructive"}>
                Delete video
              </Button>
            </Modal.Trigger>
            <Modal.Header title="You want delete this video?" />
            <Modal.Content>
              <div className="flex items-center justify-end gap-5">
                <Button
                  variant={"secondary"}
                  onClick={() => setIsDeletingOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteVideo(video.id, {
                      onSuccess(data) {
                        router.push(StudioRoutes.VIDEOS);
                        toast.success("Video deleted successfully!");
                        setIsDeletingOpen(false);
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </div>
            </Modal.Content>
          </Modal>
        </div>
      </div>
      <div className="mt-5">
        <VideoEditThumbnail
          thumbnailFile={thumbnailFile}
          setThumbnailFile={setThumbnailFile}
          video={video}
        />
      </div>
      <div className="mt-5">
        <p className="text-lg">Video's Title</p>
        <p className="text-sm text-primary/70 mb-5">
          Come up with a video title that represents video's content.
        </p>
        <Input
          label="Title"
          error={errors.title?.message}
          {...register("title")}
        />
      </div>
      <div className="mt-5">
        <p className="text-lg mb-5">Video's Description</p>
        <Controller
          name="description"
          control={control}
          render={({ field }) => {
            return (
              <HtmlEditor
                placeholder="Video's description"
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            );
          }}
        />
        {errors.description?.message && (
          <p className="mt-2 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="mt-5">
        <p className="text-lg mb-5">Video's Tags</p>
        <Badge variant="info">To add tags, press enter after each tag</Badge>
        <div className="mt-1">
          <VideoTagsInput tags={tags} setTags={setTags} />
        </div>
      </div>
    </form>
  );
};

export default VideoEditForm;
