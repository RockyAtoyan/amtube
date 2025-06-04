"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

import { FC, useState } from "react";

import { Settings } from "lucide-react";

import { PlayerState, VideoPlayerControls } from "./use-video-player";

interface VideoQualitySelectProps {
  playerState: PlayerState;
  controls: VideoPlayerControls;
}

const VideoQualitySelect: FC<VideoQualitySelectProps> = ({
  playerState,
  controls,
}) => {
  const { isHlsSupported, qualityLevels, currentQuality, isAutoQuality } =
    playerState;

  const [isOpen, setIsOpen] = useState(false);

  const handleQualitySelect = async (level: number) => {
    setIsOpen(false);
    await controls.setQuality(level);
  };

  if (!isHlsSupported || qualityLevels.length === 0) {
    return null;
  }

  const displayQuality = isAutoQuality
    ? `Auto (${qualityLevels[currentQuality]?.height || "N/A"}p)`
    : `${qualityLevels[currentQuality]?.height || "N/A"}p`;

  return (
    <Popover open={isOpen} onOpenChange={(value) => setIsOpen(value)}>
      <PopoverTrigger>
        <button className="flex items-center space-x-1 text-white hover:text-accent transition text-sm">
          <Settings className="w-5 h-5" />
          <span>{displayQuality}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-max bg-neutral-800 border-neutral-600 text-white p-2 rounded-lg">
        <div>
          <ul className="space-y-1">
            <li className="text-xs mb-2 opacity-80">Quality</li>
            <li>
              <button
                onClick={() => handleQualitySelect(-1)}
                className={`cursor-pointer w-full text-left px-2 py-1 rounded text-sm hover:bg-neutral-700 transition ${
                  isAutoQuality ? "bg-neutral-700 font-semibold" : ""
                }`}
              >
                Auto
                {isAutoQuality && <span className="ml-2 text-accent">✓</span>}
              </button>
            </li>
            {qualityLevels.map((level, index) => (
              <li key={index}>
                <button
                  onClick={() => handleQualitySelect(index)}
                  className={`cursor-pointer w-full text-left px-2 py-1 rounded text-sm hover:bg-neutral-700 transition ${
                    !isAutoQuality && currentQuality === index
                      ? "bg-neutral-700 font-semibold"
                      : ""
                  }`}
                >
                  {level.height}p
                  {!isAutoQuality && currentQuality === index && (
                    <span className="ml-2 text-accent">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VideoQualitySelect;
