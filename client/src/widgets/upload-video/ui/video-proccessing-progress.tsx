import { FC } from "react";

interface Props {
  processingProgress: number;
}

const VideoProccessingProgress: FC<Props> = ({ processingProgress }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Processing video...</span>
        <span className="text-sm text-primary/60">{processingProgress}%</span>
      </div>
      <div className="w-full bg-border/30 rounded-full h-2.5">
        <div
          className="bg-accent h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${processingProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VideoProccessingProgress;
