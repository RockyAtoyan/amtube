import Badge from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import DropZone from "@/shared/ui/drop-zone";

import { useState } from "react";

import VideoProccessingProgress from "./video-proccessing-progress";

interface Props {
  videoFile: File | null;
  handleFileDrop: (files: File[]) => void;
  handleClearFile: () => void;
  isProcessing: boolean;
  isUploadingPending: boolean;
  processingProgress: number;
  processingError: string | null;
  setStep: (step: number) => void;
}

const VideoProccessingForm = ({
  videoFile,
  handleFileDrop,
  handleClearFile,
  isProcessing,
  isUploadingPending,
  processingProgress,
  processingError,
  setStep,
}: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleStartingProccessing = () => {
    handleFileDrop(files);
  };

  const handleClear = () => {
    setFiles([]);
    handleClearFile();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Step 1: Upload Video File</h3>
        <p className="text-sm text-primary/60 mb-4">
          Select a video file to upload. Supported formats: MP4, WebM, MOV
        </p>

        <DropZone
          onDrop={(files: File[]) => setFiles(files)}
          onClear={handleClear}
          disabled={isProcessing || isUploadingPending}
          maxFiles={1}
          accept={{
            "video/mp4": [".mp4"],
            "video/webm": [".webm"],
            "video/quicktime": [".mov"],
          }}
          className='h-50 flex items-center justify-center'
        />

        {!isProcessing && files.length > 0 && (
          <Button type="button" className='mt-4' onClick={handleStartingProccessing}>
            Start processing
          </Button>
        )}

        {isProcessing && (
          <div className="mt-4">
            <VideoProccessingProgress processingProgress={processingProgress} />
          </div>
        )}

        {processingError && (
          <Badge className="mt-4" variant="info">
            {processingError}
          </Badge>
        )}
      </div>

      {videoFile && !isProcessing && !processingError && (
        <div className="flex justify-end">
          <Button
            onClick={() => setStep(2)}
            className="bg-accent hover:bg-accent/90"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoProccessingForm;
