"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface YouTubePlayerProps {
  youtubeUrl: string;
  title?: string;
  onVideoEnd?: () => void;
}

export function YouTubePlayer({
  youtubeUrl,
  title = "Video Player",
  onVideoEnd,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playerRef = useRef<any>(null);
  const videoIdRef = useRef<string | null>(null);

  const getYouTubeVideoId = (url: string | undefined | null): string | null => {
    try {
      if (!url || typeof url !== "string") return null;
      if (url.includes("youtu.be")) {
        const segments = url.split("/");
        const lastSegment = segments[segments.length - 1];
        return lastSegment.split("?")[0];
      }
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match?.[7]?.length === 11 ? match[7] : null;
    } catch (err) {
      console.error("Error extracting YouTube ID:", err);
      return null;
    }
  };

  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).YT?.Player) return resolve();
      window.onYouTubeIframeAPIReady = () => resolve();
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.getElementsByTagName("script")[0]?.parentNode?.appendChild(tag);
    });
  };

  const initializePlayer = async (videoId: string) => {
    if (!playerContainerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);
      await loadYouTubeAPI();

      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error(e);
        }
        playerRef.current = null;
      }

      playerContainerRef.current.innerHTML = "";
      const playerElement = document.createElement("div");
      playerElement.id = `youtube-player-${Date.now()}`;
      playerContainerRef.current.appendChild(playerElement);

      playerRef.current = new (window as any).YT.Player(playerElement.id, {
        videoId,
        height: "100%",
        width: "100%",
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: any) => {
            const player = e.target;
            setDuration(player.getDuration());
            player.setVolume(volume);
            if (isMuted) player.mute();
            setCurrentTime(0);
            setIsLoading(false);
          },
          onStateChange: (e: any) => {
            const YT = (window as any).YT;
            const newState = e.data;
            setIsPlaying(newState === YT.PlayerState.PLAYING);
            setIsLoading(newState === YT.PlayerState.BUFFERING);
            if (newState === YT.PlayerState.ENDED) onVideoEnd?.();
          },
          onError: (e: any) => {
            const errorMessages = {
              2: "Invalid YouTube video ID",
              5: "HTML5 player error",
              100: "Video not found",
              101: "Playback restricted",
              150: "Playback restricted",
            };
            setError("Playback error");
            setIsLoading(false);
          },
        },
      });
      videoIdRef.current = videoId;
    } catch (error) {
      console.error("Player initialization error:", error);
      setError("Failed to initialize player");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const videoId = getYouTubeVideoId(youtubeUrl);
    if (!videoId) return setError("Invalid YouTube URL");
    if (videoId !== videoIdRef.current) initializePlayer(videoId);
  }, [youtubeUrl]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      try {
        setCurrentTime(playerRef.current?.getCurrentTime() || 0);
      } catch {}
    }, 1000);
    return () => clearInterval(timeInterval);
  }, [isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current || isLoading) return;
      const key = e.key.toLowerCase();
      const seekTime = currentTime + (key === "arrowright" ? 10 : -10);

      if ([" ", "k"].includes(key)) togglePlay();
      if (key === "m") toggleMute();
      if (key === "f") toggleFullscreen();
      if (["arrowright", "arrowleft"].includes(key))
        playerRef.current.seekTo(Math.max(0, seekTime), true);
      if (["arrowup", "arrowdown"].includes(key)) {
        const newVolume = volume + (key === "arrowup" ? 10 : -10);
        setVolume(Math.min(100, Math.max(0, newVolume)));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLoading, volume, currentTime]);
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current || isLoading) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current || isLoading) return;
    isMuted ? playerRef.current.unMute() : playerRef.current.mute();
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    try {
      if (document.fullscreenElement) {
        // If something is in fullscreen, exit
        document.exitFullscreen();
      } else {
        // Otherwise, enter fullscreen
        containerRef.current.requestFullscreen();
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const handleSeek = (value: number[]) => {
    playerRef.current?.seekTo((value[0] / 100) * duration, true);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    playerRef.current?.setVolume(newVolume);
    if (newVolume === 0) toggleMute();
    if (isMuted && newVolume > 0) toggleMute();
  };

  const setPlaybackSpeed = (speed: number) => {
    playerRef.current?.setPlaybackRate(speed);
    setPlaybackRate(speed);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return hours > 0
      ? `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden touch-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={playerContainerRef}
        className="absolute inset-0 w-full h-full"
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-red-500 text-center p-4">
            <div className="text-xl font-semibold mb-2">Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-40">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <div className="text-white font-medium">Loading video...</div>
          </div>
        </div>
      )}

      <div className="absolute inset-0 z-20" onClick={togglePlay} />

      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <button
            onClick={togglePlay}
            className="w-16 h-16 md:w-20 md:h-20 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
          </button>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-b from-black/70 to-transparent text-white font-medium text-sm md:text-base z-10">
        {title}
      </div>

      {!error && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 md:p-2 transition-opacity duration-300 z-30 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <Slider
            value={[currentTime ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            disabled={isLoading}
            className="bg-slate-600 w-full mb-1 md:mb-2 [&>span:first-child]:h-2 md:[&>span:first-child]:h-1 [&_[role=slider]]:w-4 md:[&_[role=slider]]:w-3 [&_[role=slider]]:h-4 md:[&_[role=slider]]:h-3"
          />

          <div className="flex items-center gap-1 md:gap-2">
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-orange-500/20"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>

            <div className="hidden sm:flex gap-1 md:gap-2">
              <Button
                onClick={() =>
                  playerRef.current?.seekTo(Math.max(0, currentTime - 10), true)
                }
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-orange-500/20"
              >
                <SkipBack className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
              <Button
                onClick={() =>
                  playerRef.current?.seekTo(currentTime + 10, true)
                }
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-orange-500/20"
              >
                <SkipForward className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>

            <div className="text-xs md:text-sm text-white min-w-[100px] md:min-w-[120px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="flex items-center gap-1 md:gap-2 ml-auto">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-orange-500/20"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </Button>
              <div className="hidden md:block w-16">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  className="[&_[role=slider]]:w-3 [&_[role=slider]]:h-3"
                />
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 text-white hover:bg-orange-500/20"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-gray-700 text-white">
                <div className="px-2 py-1.5 text-xs font-semibold text-orange-500">
                  Playback Speed
                </div>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
                  <DropdownMenuItem
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`${
                      playbackRate === speed
                        ? "bg-orange-500/20 text-orange-500"
                        : ""
                    } hover:bg-orange-500/10`}
                  >
                    {speed === 1 ? "Normal" : `${speed}x`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-orange-500/20"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Maximize className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
