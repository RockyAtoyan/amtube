import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FileInput } from "@/shared/ui/input";

import { FC } from "react";

import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  thumbnailFile: File | null;
  setThumbnailFile: (file: File | null) => void;
}

const UploadVideoThumbnailInput: FC<Props> = ({
  thumbnailFile,
  setThumbnailFile,
}) => {
  return (
    <div className="space-y-4">
      <div className="h-50 aspect-video rounded-md overflow-hidden border border-border">
        {thumbnailFile ? (
          <Image
            src={URL.createObjectURL(thumbnailFile)}
            alt="Thumbnail"
            width={100}
            height={100}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="text-primary/50" size={32} />
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <FileInput
            accept="image/*"
            placeholder="Select thumbnail"
            onFileSelect={(file) => setThumbnailFile(file)}
          />
          {thumbnailFile && (
            <Button
              size="lg"
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
  );
};

export default UploadVideoThumbnailInput;
