import { useProcessVideoFile } from "@/entities/video/api/hooks";
import { ROUTES } from "@/shared/api/routes";

import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  channelId: string;
  setTitleValue: (value: string) => void;
  setStep: (step: number) => void;
  setVideoId: Dispatch<SetStateAction<string | null>>;
  setVideoFile: Dispatch<SetStateAction<File | null>>;
  setIsProcessing: (isProcessing: boolean) => void;
  setProcessingProgress: (progress: number) => void;
  setProcessingError: (error: string | null) => void;
}

export const useVideoProccessing = ({
  channelId,
  setTitleValue,
  setStep,
  setVideoId,
  setIsProcessing,
  setProcessingError,
  setProcessingProgress,
  setVideoFile,
}: Props) => {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const { processVideoFile } = useProcessVideoFile();

  const startVideoProcessing = async (file: File) => {
    try {
      setIsProcessing(true);
      setProcessingProgress(0);
      setProcessingError(null);

      const formData = new FormData();
      formData.append("file", file);

      const video = await processVideoFile({
        title: "0",
        description: "0",
        channelId,
        file,
      });
      if (video) setVideoId((prev) => video.id);

      const sse = new EventSource(
        process.env.NEXT_PUBLIC_API_URL + ROUTES.videos.sse.path,
        {
          withCredentials: true,
        },
      );
      setEventSource(sse);

      sse.addEventListener("video-processing-progress", (event) => {
        const data = JSON.parse(event.data);

        if (data.videoId !== video?.id) {
          return;
        }

        if (data.progress) {
          setProcessingProgress(data.progress);
        }
      });

      sse.addEventListener("video-processing-success", (event) => {
        const data = JSON.parse(event.data);
        if (data.videoId !== video?.id) {
          return;
        }
        toast.success("Video proccessed successfully!");
        setTitleValue(file.name);
        setIsProcessing(false);
        sse.close();
        setEventSource(null);
        setStep(2);
      });

      sse.addEventListener("video-processing-error", (event) => {
        const data = JSON.parse(event.data);
        if (data.videoId !== video?.id) {
          return;
        }
        setProcessingError(
          data.message || "An error occurred during processing",
        );
        setIsProcessing(false);
        sse.close();
        setEventSource(null);
      });

      sse.onerror = () => {
        toast.error("Connection error. Please reload page!");
        setProcessingError("Connection error. Please reload page!");
        setIsProcessing(false);
        setEventSource(null);
      };
    } catch (error) {
      setProcessingError("Connection error. Please try again.");
      setIsProcessing(false);
      setEventSource(null);
    }
  };

  const handleError = (error: string) => {
    setProcessingError(error);
    setIsProcessing(false);
    setEventSource(null);
    eventSource?.close();
  };

  const handleClearFile = () => {
    setVideoFile(null);
    setTitleValue("");

    if (eventSource) {
      eventSource.close();
      setEventSource(null);
    }

    setIsProcessing(false);
    setProcessingProgress(0);
    setProcessingError(null);
  };

  return { startVideoProcessing, handleError, handleClearFile };
};
