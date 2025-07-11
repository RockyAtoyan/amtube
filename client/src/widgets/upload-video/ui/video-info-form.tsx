import VideoTagsInput from "@/features/video-tags-input/video-tags-input";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import HtmlEditor from "@/shared/ui/html-editor/html-editor";
import Input from "@/shared/ui/input";

import { FC } from "react";
import { Control, Controller, UseFormReturn } from "react-hook-form";

import { Loader2, Upload } from "lucide-react";

import { FormValues } from "../use-upload-video";
import UploadVideoThumbnailInput from "./upload-video-thumbnail-input";

interface Props {
  handleSubmit: UseFormReturn<FormValues>["handleSubmit"];
  onSubmit: (data: FormValues) => Promise<void>;
  errors: UseFormReturn<FormValues>["formState"]["errors"];
  register: UseFormReturn<FormValues>["register"];
  tags: string[];
  setTags: (tags: string[]) => void;
  thumbnailFile: File | null;
  setThumbnailFile: (file: File | null) => void;
  videoFile: File | null;
  handleCanceling: () => void;
  isLoading: boolean;
  videoId: string | null;
  isSubmitting: boolean;
  isUploadingPending: boolean;
  control: Control<FormValues>;
}

const VideoInfoForm: FC<Props> = ({
  handleSubmit,
  onSubmit,
  errors,
  register,
  tags,
  handleCanceling,
  isLoading,
  setTags,
  setThumbnailFile,
  thumbnailFile,
  videoFile,
  videoId,
  isSubmitting,
  isUploadingPending,
  control,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Step 2: Add Video Details</h3>
        <p className="text-sm text-primary/60 mb-4">
          Provide information about your video
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2">
            <div className="space-y-4 pr-8 border-r border-border">
              <Input
                labelClassName="bg-secondary"
                label="Title"
                error={errors.title?.message}
                {...register("title")}
              />

              <div>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <HtmlEditor
                      placeholder="Video's description"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                    />
                  )}
                />
                {errors.description?.message && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <Badge variant="info">
                To add tags, press enter after each tag
              </Badge>
              <div className="mt-1">
                <VideoTagsInput tags={tags} setTags={setTags} />
              </div>
            </div>
            <div className="pl-8">
              <UploadVideoThumbnailInput
                thumbnailFile={thumbnailFile}
                setThumbnailFile={setThumbnailFile}
              />
            </div>
          </div>

          {videoFile && (
            <div className="p-3 bg-primary/5 rounded-md border border-border/30">
              <p className="text-sm font-medium">Selected file:</p>
              <p className="text-sm text-primary/70">{videoFile.name}</p>
              <p className="text-xs text-primary/50">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleCanceling()}
          disabled={!videoId || isLoading}
        >
          Cancel upload
        </Button>

        <Button
          type="submit"
          disabled={!videoFile || isLoading}
          className="bg-accent hover:bg-accent/90"
        >
          {isSubmitting || isUploadingPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default VideoInfoForm;
