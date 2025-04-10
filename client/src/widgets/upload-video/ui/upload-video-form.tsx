"use client";

import { cn } from "@/shared/lib";

import { FC, useState } from "react";

import { useUploadVideo } from "../use-upload-video";
import VideoInfoForm from "./video-info-form";
import VideoProccessingForm from "./video-proccessing-form";

interface Props {
  channelId: string;
}

const UploadVideoForm: FC<Props> = ({ channelId }) => {
  const [step, setStep] = useState(1);

  const {
    isLoading,
    handleCanceling,
    onSubmit,
    handleFileDrop,
    tags,
    errors,
    register,
    handleSubmit,
    videoFile,
    thumbnailFile,
    videoId,
    isProcessing,
    processingProgress,
    processingError,
    isUploadingPending,
    setTags,
    setThumbnailFile,
    handleClearFile,
    isSubmitting,
    control,
  } = useUploadVideo({ channelId, setStep });

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto p-6 bg-secondary/80 rounded-xl shadow-xl border border-border/20",
        step === 2 && "max-w-full",
      )}
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-accent">
        Upload Video
      </h2>

      {step === 1 && (
        <VideoProccessingForm
          videoFile={videoFile}
          handleFileDrop={handleFileDrop}
          handleClearFile={handleClearFile}
          isProcessing={isProcessing}
          isUploadingPending={isUploadingPending}
          processingProgress={processingProgress}
          processingError={processingError}
          setStep={setStep}
        />
      )}

      {step === 2 && (
        <VideoInfoForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
          register={register}
          tags={tags}
          setTags={setTags}
          thumbnailFile={thumbnailFile}
          setThumbnailFile={setThumbnailFile}
          videoFile={videoFile}
          handleCanceling={handleCanceling}
          isLoading={isLoading}
          videoId={videoId}
          isSubmitting={isSubmitting}
          isUploadingPending={isUploadingPending}
          control={control}
        />
      )}
    </div>
  );
};

export default UploadVideoForm;
