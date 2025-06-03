"use client";

import { FC, useEffect, useRef, useState } from "react"

import { PlayerState, VideoPlayerControls } from "./use-video-player"

interface VideoProgressBarProps {
  playerState: PlayerState;
  controls: VideoPlayerControls;
}

const VideoProgressBar: FC<VideoProgressBarProps> = ({
  playerState,
  controls,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const parseVttTime = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(":");
    const [secs, millis] = seconds.split(".");
    return (
      parseInt(minutes) * 60 + parseInt(secs) + parseInt(millis || "0") / 1000
    );
  };

  const handleSeek = (e: React.MouseEvent | React.TouchEvent) => {
    if (!progressBarRef.current || !playerState.duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const pos = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const seekTime = pos * playerState.duration;

    controls.seek(seekTime);
    if (playerState.isPlaying) {
      controls.play().catch(() => {});
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!progressBarRef.current || !playerState.duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const time = pos * playerState.duration;

    setHoverTime(time);
    setTooltipPosition({ x: e.clientX - rect.left, y: rect.top });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSeek(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleSeek(e as unknown as React.MouseEvent);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={progressBarRef}
      className="relative h-1 w-full bg-gray-700 rounded-full cursor-pointer group"
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onClick={handleSeek}
    >
      <div
        className="absolute top-0 left-0 h-full bg-gray-500/50 rounded-full"
        style={{ width: `${playerState.buffered * 100}%` }}
      />

      <div
        className="absolute top-0 left-0 h-full bg-accent rounded-full"
        style={{ width: `${playerState.progress}%` }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {hoverTime !== null && (
        <div
          className="absolute top-[-60px] transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded flex flex-col items-center"
          style={{ left: `${tooltipPosition.x}px` }}
        >
          <span>{formatTime(hoverTime)}</span>
        </div>
      )}
    </div>
  );
};

export default VideoProgressBar;
