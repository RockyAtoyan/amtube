import { useDeleteVideo, useUpdateVideo } from "@/entities/video/api/hooks";
import { useUploadMedia } from "@/shared/lib/hooks/useUploadMedia";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { yupResolver } from "@hookform/resolvers/yup";

import * as yup from "yup";

import { useVideoProccessing } from "./use-video-proccessing";

const schema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required!")
    .max(100, "Title is too long!"),
  description: yup
    .string()
    .required("Description is required!")
    .max(5000, "Description is too long!"),
});

export type FormValues = yup.InferType<typeof schema>;

interface Props {
  channelId: string;
  setStep: (step: number) => void;
}

export const useUploadVideo = ({ channelId, setStep }: Props) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { startVideoProcessing, handleError, handleClearFile } =
    useVideoProccessing({
      channelId,
      setTitleValue: (value: string) => setValue("title", value),
      setStep,
      setVideoId,
      setIsProcessing,
      setProcessingProgress,
      setProcessingError,
      setVideoFile,
    });
  const { uploadMedia, isMediaUploading } = useUploadMedia();
  const {
    updateVideo,
    isPending: isUploadingPending,
    isError: isUploadingError,
  } = useUpdateVideo();
  const { deleteVideo, isPending: isDeletingPending } = useDeleteVideo();

  const isLoading =
    isSubmitting || isUploadingPending || isDeletingPending || isMediaUploading;

  useEffect(() => {
    if (isUploadingError) {
      handleError("An error occurred during processing");
    }
  }, [isUploadingError]);

  const handleReset = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setTags([]);
    reset();
  };

  const handleFileDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setVideoFile(file);

      const defaultTitle = file.name.replace(/\.[^/.]+$/, "");
      setValue("title", defaultTitle);

      startVideoProcessing(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!videoFile || !videoId) {
      return;
    }

    try {
      const thumbnailUrl =
        thumbnailFile &&
        (await uploadMedia({
          uploadPath: "/videos-thumbnails",
          filename: videoId,
          file: thumbnailFile,
        }));

      await updateVideo({
        id: videoId,
        dto: {
          title: data.title,
          description: data.description,
          tags,
          thumbnailUrl: thumbnailUrl || undefined,
        },
        isUploading: true,
      });

      setStep(1);
      handleReset();
      toast.success("Video uploaded successfully!");
    } catch (error) {
      toast.error("An error occurred during uploading thumbnail. Try again!");
    }
  };

  const handleCanceling = async () => {
    if (!videoId) {
      handleError("");
      return;
    }
    try {
      await deleteVideo(videoId);
    } catch (error) {}
    handleError("");
    handleClearFile();
    setStep(1);
    handleReset();
  };

  return {
    isLoading,
    handleCanceling,
    onSubmit,
    handleFileDrop,
    processingProgress,
    processingError,
    tags,
    errors,
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
    videoFile,
    thumbnailFile,
    videoId,
    isProcessing,
    isUploadingPending,
    setTags,
    setThumbnailFile,
    handleClearFile,
    isSubmitting,
  };
};
