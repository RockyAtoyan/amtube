"use client";

import { PlaylistWithRelations } from "@/entities/playlist/model/playlist-with-relations";
import { VideoWithRelations } from "@/entities/video/model/video-with-relations";
import { PublicRoutes } from "@/shared/config/routes/public.routes";

import { FC, useEffect, useRef } from "react";

import {
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume1,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useVideoPlayer } from "./use-video-player";
import VideoProgressBar from "./video-progress-bar";
import VideoQualitySelect from "./video-quality-select";
import VideoSpeedSelect from "./video-speed-select";

interface Props {
  video: VideoWithRelations;
  playlist?: PlaylistWithRelations;
}

const VideoPlayer: FC<Props> = ({ video, playlist }) => {
  const router = useRouter();

  const { videoRef, controls, playerState } = useVideoPlayer({
    src: `${process.env.NEXT_PUBLIC_API_URL}/` + video.videoSrc,
    autoplay: false,
    onEnd:
      playlist &&
      function () {
        let index = playlist.videos.findIndex((v) => v.id === video.id);
        if (index === -1) return;
        const nextVideo = playlist?.videos[index + 1];
        if (!nextVideo) return;
        router.push(PublicRoutes.VIDEO(nextVideo.publicId, playlist.id));
      },
  });
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !playerContainerRef.current ||
        !playerContainerRef.current.contains(document.activeElement)
      ) {
        return;
      }
      if (
        [
          " ",
          "Space",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case " ":
        case "k":
          controls.togglePlay();
          break;
        case "arrowleft":
          controls.seek(Math.max(playerState.currentTime - 5, 0));
          break;
        case "arrowright":
          controls.seek(
            Math.min(playerState.currentTime + 5, playerState.duration),
          );
          break;
        case "arrowup":
          controls.setVolume(Math.min(playerState.volume + 0.05, 1));
          break;
        case "arrowdown":
          controls.setVolume(Math.max(playerState.volume - 0.05, 0));
          break;
        case "m":
          controls.toggleMute();
          break;
        case "f":
          controls.toggleFullscreen();
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          const percentage = parseInt(e.key) * 10;
          controls.seek((percentage / 100) * playerState.duration);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    controls,
    playerState.currentTime,
    playerState.volume,
    playerState.duration,
  ]);

  const handleButtonKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className="aspect-video relative w-full bg-black rounded-lg overflow-hidden focus:outline-none"
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain object-center"
        controls={false}
        onClick={controls.togglePlay}
      />

      {(playerState.isQualitySwitching || playerState.isBuffering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 transition-opacity">
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      <div className="controls-container absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
        <VideoProgressBar playerState={playerState} controls={controls} />

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3">
            <button
              className="text-white hover:text-accent focus:ring-2 focus:ring-accent focus:outline-none rounded p-1 transition"
              onClick={controls.togglePlay}
              onKeyDown={(e) => handleButtonKeyDown(e, controls.togglePlay)}
              tabIndex={0}
              aria-label={playerState.isPlaying ? "Pause" : "Play"}
            >
              {playerState.isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="flex items-center space-x-1 text-white text-xs">
              <span>{formatTime(playerState.currentTime)}</span>
              <span>/</span>
              <span>{formatTime(playerState.duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <button
                className="text-white hover:text-accent focus:ring-2 focus:ring-accent focus:outline-none rounded p-1 transition"
                onClick={controls.toggleMute}
                onKeyDown={(e) => handleButtonKeyDown(e, controls.toggleMute)}
                tabIndex={0}
                aria-label={playerState.isMuted ? "Unmute" : "Mute"}
              >
                {playerState.isMuted || playerState.volume === 0 ? (
                  <VolumeOff size={18} />
                ) : playerState.volume > 0.5 ? (
                  <Volume2 size={18} />
                ) : (
                  <Volume1 size={18} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={playerState.volume}
                onChange={(e) => controls.setVolume(parseFloat(e.target.value))}
                className="w-16 accent-accent focus:ring-2 focus:ring-accent focus:outline-none"
                tabIndex={0}
                aria-label="Volume"
              />
            </div>

            <VideoSpeedSelect playerState={playerState} controls={controls} />

            <VideoQualitySelect playerState={playerState} controls={controls} />

            <button
              className="text-white hover:text-accent focus:ring-2 focus:ring-accent focus:outline-none rounded p-1 transition"
              onClick={controls.toggleFullscreen}
              onKeyDown={(e) =>
                handleButtonKeyDown(e, controls.toggleFullscreen)
              }
              tabIndex={0}
              aria-label={
                playerState.isFullscreen
                  ? "Exit Fullscreen"
                  : "Enter Fullscreen"
              }
            >
              {playerState.isFullscreen ? (
                <Minimize size={18} />
              ) : (
                <Maximize size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

export default VideoPlayer;
