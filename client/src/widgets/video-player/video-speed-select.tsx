"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import { FC, useState } from "react";

import { Clock } from "lucide-react";

import { PlayerState, VideoPlayerControls } from "./use-video-player";

interface VideoSpeedSelectProps {
  playerState: PlayerState;
  controls: VideoPlayerControls;
}

const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

const VideoSpeedSelect: FC<VideoSpeedSelectProps> = ({
  playerState,
  controls,
}) => {
  const { playbackRate } = playerState;

  const [isOpen, setIsOpen] = useState(false);

  const handleSpeedSelect = (rate: number) => {
    controls.setPlaybackRate(rate);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value);
      }}
    >
      <PopoverTrigger>
        <button className="flex items-center space-x-1 text-white hover:text-accent transition text-sm">
          <Clock className="w-5 h-5" />
          <span>{playbackRate}x</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-max bg-neutral-800 border-neutral-700 text-white p-2 rounded-lg">
        <ul className="space-y-1">
          <li className="text-xs mb-2 opacity-80">Speed</li>
          {playbackRates.map((rate) => (
            <li key={rate}>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleSpeedSelect(rate);
                }}
                className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-neutral-700 transition ${
                  playbackRate === rate ? "bg-neutral-700 font-semibold" : ""
                }`}
              >
                {rate}x
                {playbackRate === rate && (
                  <span className="ml-2 text-accent">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default VideoSpeedSelect;
