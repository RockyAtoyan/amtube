"use client";

import { useEffect, useRef, useState } from "react";

import Hls, { ErrorData, HlsConfig, Level as HlsLevel } from "hls.js";

export type VideoPlayerControls = {
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => Promise<void>;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  requestFullscreen: () => void;
  exitFullscreen: () => void;
  toggleFullscreen: () => void;
  setPlaybackRate: (rate: number) => void;
  setAutoQuality: (auto: boolean) => Promise<void>;
  setQuality: (level: number) => Promise<void>;
};

export type PlayerState = {
  isPlaying: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  isHlsSupported: boolean;
  qualityLevels: HlsLevel[];
  currentQuality: number;
  isAutoQuality: boolean;
  buffered: number;
  isQualitySwitching: boolean;
  isBuffering: boolean; // Новое состояние для буферизации
};

type UseVideoPlayerOptions = {
  src: string;
  hlsConfig?: HlsConfig;
  autoplay?: boolean;
  startTime?: number;
  onEnd?: () => void;
};

export const useVideoPlayer = ({
  src,
  hlsConfig,
  autoplay = false,
  startTime = 0,
  onEnd,
}: UseVideoPlayerOptions) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    playbackRate: 1,
    isHlsSupported: false,
    qualityLevels: [],
    currentQuality: -1,
    isAutoQuality: true,
    buffered: 0,
    isQualitySwitching: false,
    isBuffering: false,
  });

  const isManualQualitySelection = useRef(false);

  // Проверка достаточности буфера для аудио и видео
  const hasEnoughBuffer = () => {
    const video = videoRef.current;
    if (!video) return false;
    const bufferedEnd = video.buffered.length
      ? video.buffered.end(video.buffered.length - 1)
      : 0;
    return bufferedEnd >= video.currentTime + 3; // Минимум 3 секунды буфера
  };

  // Общая логика переключения качества
  const handleQualitySwitch = async (level: number, manualChange = true) => {
    if (hlsInstance.current && playerState.isHlsSupported) {
      const auto = manualChange ? level === -1 : playerState.isAutoQuality;
      setPlayerState((prev) => ({
        ...prev,
        isQualitySwitching: true,
        isAutoQuality: auto,
        currentQuality: level,
      }));
      isManualQualitySelection.current = !auto;
      console.log(
        `Switching to quality level ${level} (${auto ? "auto" : "manual"})`,
      );

      // Полная остановка воспроизведения и очистка буфера
      videoRef.current?.pause();
      hlsInstance.current.stopLoad();
      if (videoRef.current) {
        videoRef.current.src = ""; // Сбрасываем источник
        hlsInstance.current.detachMedia();
        hlsInstance.current.attachMedia(videoRef.current);
      }
      hlsInstance.current.currentLevel = level;
      const currentTime = videoRef.current?.currentTime || 0;
      hlsInstance.current.startLoad(currentTime);

      // Ждем достаточной буферизации
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (hasEnoughBuffer() && playerState.isPlaying) {
        videoRef.current?.play().catch((err) => {
          console.error("Failed to resume playback:", err);
          setPlayerState((prev) => ({ ...prev, isQualitySwitching: false }));
        });
      } else {
        const checkBufferInterval = setInterval(() => {
          if (hasEnoughBuffer()) {
            clearInterval(checkBufferInterval);
            setPlayerState((prev) => ({ ...prev, isQualitySwitching: false }));
            if (playerState.isPlaying) {
              videoRef.current?.play().catch((err) => {
                console.error("Failed to resume playback:", err);
              });
            }
          }
        }, 200);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isHls = src.endsWith(".m3u8") || src.includes("hls");
    const hlsSupported = isHls && Hls.isSupported();

    setPlayerState((prev) => ({
      ...prev,
      isHlsSupported: hlsSupported,
    }));

    const updatePlayerState = () => {
      if (!video) return;

      setPlayerState((prev) => ({
        ...prev,
        isPlaying: !video.paused,
        progress: video.duration
          ? (video.currentTime / video.duration) * 100
          : 0,
        duration: video.duration || 0,
        currentTime: video.currentTime || 0,
        volume: video.volume,
        isMuted: video.muted,
        playbackRate: video.playbackRate,
        buffered: video.buffered.length
          ? video.buffered.end(video.buffered.length - 1) / video.duration
          : 0,
      }));
    };

    const endVideo = () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      onEnd?.();
    };

    const playVideo = () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: true }));
    };

    const pauseVideo = () => {
      setPlayerState((prev) => ({ ...prev, isPlaying: false }));
    };

    const changeFullscreen = () => {
      setPlayerState((prev) => ({
        ...prev,
        isFullscreen: !!document.fullscreenElement,
      }))
    }

    const handleWaiting = () => {
      setPlayerState((prev) => ({ ...prev, isBuffering: true }));
      console.log("Video is buffering...");
    };

    const handlePlaying = () => {
      setPlayerState((prev) => ({ ...prev, isBuffering: false }));
      console.log("Video is playing, buffering complete.");
    };

    if (hlsSupported) {
      const hls = new Hls({
        maxBufferLength: 15,
        maxMaxBufferLength: 30,
        abrEwmaSlowVoD: 0.1,
        abrEwmaFastVoD: 0.1,
        maxStarvationDelay: 1.5,
        liveSyncDurationCount: 3,
        autoStartLoad: true,
        ...hlsConfig,
      });

      hlsInstance.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        hls.attachMedia(video);
        setPlayerState((prev) => ({
          ...prev,
          qualityLevels: hls.levels,
          currentQuality: -1,
          isAutoQuality: true,
        }));
        hls.currentLevel = -1;
        isManualQualitySelection.current = false;
        if (startTime > 0) {
          video.currentTime = startTime;
        }
        if (autoplay) video.play().catch(() => {});
      });

      hls.on(Hls.Events.LEVEL_SWITCHING, (event, data) => {
        console.log("Level switching to:", data.level);
        if (playerState.isAutoQuality && !isManualQualitySelection.current) {
          handleQualitySwitch(data.level, false);
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log("Level switched to:", data.level);
        setPlayerState((prev) => ({
          ...prev,
          currentQuality: data.level,
        }));
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        console.log("Fragment loaded, checking buffer...");
        if (hasEnoughBuffer()) {
          setPlayerState((prev) => ({ ...prev, isQualitySwitching: false }));
          if (playerState.isPlaying && video.paused) {
            video.play().catch((err) => {
              console.error("Failed to resume playback:", err);
            });
          }
        }
      });

      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, () => {
        console.log("Audio track switched, ensuring sync...");
        if (hasEnoughBuffer() && playerState.isPlaying && video.paused) {
          video.play().catch((err) => {
            console.error("Failed to resume playback after audio switch:", err);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data: ErrorData) => {
        console.log("HLS Error:", data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.warn("Network error, retrying...");
              setPlayerState((prev) => ({ ...prev, isBuffering: true }));
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn("Media error, attempting recovery...");
              hls.recoverMediaError();
              setTimeout(() => {
                if (hasEnoughBuffer() && video.paused) {
                  video.play().catch(() => {});
                }
              }, 1000);
              break;
            default:
              console.error("Fatal error, destroying HLS instance...");
              hls.destroy();
              setPlayerState((prev) => ({ ...prev, isBuffering: false }));
              break;
          }
        } else {
          switch (data.details) {
            case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
              console.warn("Buffer stalled, attempting to recover...");
              setPlayerState((prev) => ({ ...prev, isBuffering: true }));
              hls.startLoad();
              if (hasEnoughBuffer() && video.paused) {
                video.play().catch(() => {});
              }
              break;
            case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
              console.warn("Buffer append error, attempting to recover...");
              setPlayerState((prev) => ({ ...prev, isBuffering: true }));
              hls.startLoad();
              break;
            case Hls.ErrorDetails.AUDIO_TRACK_LOAD_ERROR:
              console.warn("Audio track load error, retrying...");
              setPlayerState((prev) => ({ ...prev, isBuffering: true }));
              hls.startLoad();
              setTimeout(() => {
                if (hasEnoughBuffer() && video.paused) {
                  video.play().catch(() => {});
                }
              }, 1000);
              break;
            default:
              console.warn("Non-fatal error:", data.details);
              break;
          }
        }
      });

      hls.loadSource(src);
    } else {
      video.src = src;
      if (startTime > 0) {
        video.currentTime = startTime;
      }
      if (autoplay) video.play().catch(() => {});
    }

    video.addEventListener("timeupdate", updatePlayerState);
    video.addEventListener("durationchange", updatePlayerState);
    video.addEventListener("volumechange", updatePlayerState);
    video.addEventListener("play", playVideo);
    video.addEventListener("pause", pauseVideo);
    video.addEventListener("ended", endVideo);
    video.addEventListener("progress", updatePlayerState);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    document.addEventListener("fullscreenchange", changeFullscreen);

    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
      video.removeEventListener("timeupdate", updatePlayerState);
      video.removeEventListener("durationchange", updatePlayerState);
      video.removeEventListener("volumechange", updatePlayerState);
      video.removeEventListener("play", playVideo);
      video.removeEventListener("pause", pauseVideo);
      video.removeEventListener("ended", endVideo);
      video.removeEventListener("progress", updatePlayerState);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      document.removeEventListener("fullscreenchange", changeFullscreen);
    };
  }, [src, hlsConfig, autoplay, startTime]);

  const controls: VideoPlayerControls = {
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (error) {
          console.error("Error attempting to play:", error);
        }
      }
    },

    pause: () => {
      videoRef.current?.pause();
    },

    togglePlay: async () => {
      if (playerState.isPlaying) {
        controls.pause();
      } else {
        await controls.play();
      }
    },

    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },

    setVolume: (vol: number) => {
      if (videoRef.current) {
        const newVolume = Math.min(1, Math.max(0, vol));
        videoRef.current.volume = newVolume;
        videoRef.current.muted = newVolume === 0;
      }
    },

    toggleMute: () => {
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    },

    requestFullscreen: () => {
      if (videoRef.current) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen();
        }
      }
    },

    exitFullscreen: () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    },

    toggleFullscreen: () => {
      if (playerState.isFullscreen) {
        controls.exitFullscreen();
      } else {
        controls.requestFullscreen();
      }
    },

    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    },

    setAutoQuality: async (auto: boolean) => {
      if (hlsInstance.current && playerState.isHlsSupported) {
        isManualQualitySelection.current = !auto;
        const level = auto ? -1 : playerState.currentQuality;
        setPlayerState((prev) => ({
          ...prev,
          currentQuality: level,
          isAutoQuality: auto,
        }));
        await handleQualitySwitch(level, auto);
      }
    },

    setQuality: async (level: number) => {
      await handleQualitySwitch(level);
    },
  };

  return {
    videoRef,
    controls,
    playerState,
  };
};
