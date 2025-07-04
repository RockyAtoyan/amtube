import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import { cn } from "@/shared/lib";
import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FileInput } from "@/shared/ui/input";

import { FC } from "react";

import Image from "next/image";

interface Props {
  video: VideoWithRelations;
  thumbnailFile: File | null;
  setThumbnailFile: (file: File | null) => void;
}

const VideoEditThumbnail: FC<Props> = ({
  video,
  thumbnailFile,
  setThumbnailFile,
}) => {
  return (
    <div>
      <p className="text-lg mb-5">Video's Thumbnail</p>
      <div className="flex gap-5">
        <div className="h-50 flex-shrink-0 aspect-video rounded-md overflow-hidden border border-border flex items-center justify-center">
          <div
            className={cn(
              "block w-full h-full aspect-square overflow-hidden flex items-center justify-center bg-secondary",
              !thumbnailFile && !video?.thumbnailUrl && "bg-primary",
            )}
          >
            {thumbnailFile && (
              <Image
                src={URL.createObjectURL(thumbnailFile)}
                alt="Thumbnail"
                width={224}
                height={126}
                className="w-full h-full object-contain object-center"
              />
            )}
            {!thumbnailFile && video?.thumbnailUrl && (
              <Image
                src={
                  `${process.env.NEXT_PUBLIC_API_URL}/uploads` +
                  video.thumbnailUrl
                }
                alt="Thumbnail"
                width={224}
                height={126}
                className="w-full h-full object-contain object-center"
              />
            )}
            {!thumbnailFile && !video?.thumbnailUrl && (
              <span className="font-semibold text-base text-background">
                No thumbnail.
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <FileInput
              accept="image/*"
              placeholder="Select thumbnail"
              onFileSelect={(file) => setThumbnailFile(file)}
              className="h-10 py-2 px-4"
            />
            {thumbnailFile && (
              <Button
                onClick={() => setThumbnailFile(null)}
                type="button"
                variant="secondary"
              >
                Clear thumbnail
              </Button>
            )}
          </div>
          <Badge className="mt-4" variant="info">
            The image should preferably be 16 by 9
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default VideoEditThumbnail;
