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

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string | undefined | null): string | null => {
    try {
      if (!url || typeof url !== "string") {
        return null;
      }

      // Handle youtu.be format
      if (url.includes("youtu.be")) {
        const segments = url.split("/");
        const lastSegment = segments[segments.length - 1];
        const id = lastSegment.split("?")[0];
        return id && id.length === 11 ? id : null;
      }

      // Handle youtube.com format
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7] && match[7].length === 11 ? match[7] : null;
    } catch (err) {
      console.error("Error extracting YouTube ID:", err);
      return null;
    }
  };

  // Load YouTube API
  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if ((window as any).YT && (window as any).YT.Player) {
        resolve();
        return;
      }

      // Create global callback
      window.onYouTubeIframeAPIReady = () => {
        resolve();
      };

      // Load script
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    });
  };

  // Initialize player
  const initializePlayer = async (videoId: string) => {
    if (!playerContainerRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      // Load YouTube API
      await loadYouTubeAPI();

      // Clean up existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player:", e);
        }
        playerRef.current = null;
      }

      // Clear container
      playerContainerRef.current.innerHTML = "";

      // Create player element
      const playerElement = document.createElement("div");
      playerElement.id = `youtube-player-${Date.now()}`;
      playerContainerRef.current.appendChild(playerElement);

      // Create player
      playerRef.current = new (window as any).YT.Player(playerElement.id, {
        videoId: videoId,
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
          showinfo: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
          onError: handlePlayerError,
        },
      });

      // Store current video ID
      videoIdRef.current = videoId;
    } catch (error) {
      console.error("Error initializing player:", error);
      setError("Failed to initialize player");
      setIsLoading(false);
    }
  };

  // Handle player ready event
  const handlePlayerReady = (event: any) => {
    try {
      const player = event.target;

      // Set duration
      setDuration(player.getDuration());

      // Apply volume
      player.setVolume(volume);

      // Apply mute state
      if (isMuted) {
        player.mute();
      }

      // Reset time
      setCurrentTime(0);

      // Done loading
      setIsLoading(false);
    } catch (error) {
      console.error("Error in player ready handler:", error);
      setError("Error initializing player");
      setIsLoading(false);
    }
  };

  // Handle player state change
  const handlePlayerStateChange = (event: any) => {
    try {
      const YT = (window as any).YT;
      if (!YT) return;

      const newState = event.data;

      // Update playing state
      setIsPlaying(newState === YT.PlayerState.PLAYING);

      // Update loading state
      setIsLoading(newState === YT.PlayerState.BUFFERING);

      // Handle video end
      if (newState === YT.PlayerState.ENDED && onVideoEnd) {
        onVideoEnd();
      }
    } catch (error) {
      console.error("Error in state change handler:", error);
    }
  };

  // Handle player errors
  const handlePlayerError = (event: any) => {
    const errorCode = event.data;
    let errorMessage = "An error occurred with the YouTube player";

    // Map error codes to messages
    switch (errorCode) {
      case 2:
        errorMessage = "Invalid YouTube video ID";
        break;
      case 5:
        errorMessage = "HTML5 player error";
        break;
      case 100:
        errorMessage = "Video not found or removed";
        break;
      case 101:
      case 150:
        errorMessage = "Video playback not allowed in embedded players";
        break;
    }

    console.error("YouTube player error:", errorCode, errorMessage);
    setError(errorMessage);
    setIsLoading(false);
  };

  // Update player when URL changes
  useEffect(() => {
    const videoId = getYouTubeVideoId(youtubeUrl);

    if (!videoId) {
      setError("Invalid YouTube URL");
      setIsLoading(false);
      return;
    }

    // Only reinitialize if video ID changed
    if (videoId !== videoIdRef.current) {
      initializePlayer(videoId);
    }
  }, [youtubeUrl]);

  // Apply styles to YouTube iframe
  useEffect(() => {
    if (!playerRef.current || isLoading) return;

    // Find the iframe element
    const iframe = playerContainerRef.current?.querySelector("iframe");
    if (iframe) {
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.position = "absolute";
      iframe.style.top = "0";
      iframe.style.left = "0";
    }
  }, [isLoading, playerRef.current]);

  // Set up time update interval
  useEffect(() => {
    if (!playerRef.current || isLoading) return;

    const timeInterval = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === "function"
      ) {
        try {
          setCurrentTime(playerRef.current.getCurrentTime());
        } catch (e) {
          // Silent error
        }
      }
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [isLoading]);

  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current || isLoading) return;

      try {
        switch (e.key.toLowerCase()) {
          case " ":
          case "k":
            togglePlay();
            e.preventDefault();
            break;
          case "m":
            toggleMute();
            break;
          case "f":
            toggleFullscreen();
            break;
          case "arrowright":
            if (typeof playerRef.current.seekTo === "function") {
              playerRef.current.seekTo(
                playerRef.current.getCurrentTime() + 10,
                true
              );
            }
            break;
          case "arrowleft":
            if (typeof playerRef.current.seekTo === "function") {
              playerRef.current.seekTo(
                Math.max(0, playerRef.current.getCurrentTime() - 10),
                true
              );
            }
            break;
          case "arrowup":
            const newVolumeUp = Math.min(volume + 10, 100);
            setVolume(newVolumeUp);
            if (typeof playerRef.current.setVolume === "function") {
              playerRef.current.setVolume(newVolumeUp);
            }
            break;
          case "arrowdown":
            const newVolumeDown = Math.max(volume - 10, 0);
            setVolume(newVolumeDown);
            if (typeof playerRef.current.setVolume === "function") {
              playerRef.current.setVolume(newVolumeDown);
            }
            break;
        }
      } catch (error) {
        console.error("Error handling keyboard event:", error);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoading, volume]);

  // Control visibility timeout
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }

      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);

    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player on unmount:", e);
        }
        playerRef.current = null;
      }
    };
  }, []);

  // Player controls
  const togglePlay = () => {
    if (!playerRef.current || isLoading) return;

    try {
      if (isPlaying && typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo();
      } else if (
        !isPlaying &&
        typeof playerRef.current.playVideo === "function"
      ) {
        playerRef.current.playVideo();
      }
    } catch (error) {
      console.error("Error toggling play state:", error);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || isLoading) return;

    try {
      if (isMuted && typeof playerRef.current.unMute === "function") {
        playerRef.current.unMute();
      } else if (!isMuted && typeof playerRef.current.mute === "function") {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    } catch (error) {
      console.error("Error toggling mute state:", error);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  };

  const handleSeek = (value: number[]) => {
    if (
      !playerRef.current ||
      isLoading ||
      typeof playerRef.current.seekTo !== "function"
    )
      return;

    try {
      const seekTime = (value[0] / 100) * duration;
      playerRef.current.seekTo(seekTime, true);
    } catch (error) {
      console.error("Error seeking:", error);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (!playerRef.current || isLoading) return;

    try {
      setVolume(value[0]);

      if (typeof playerRef.current.setVolume === "function") {
        playerRef.current.setVolume(value[0]);
      }

      if (value[0] === 0) {
        setIsMuted(true);
        if (typeof playerRef.current.mute === "function") {
          playerRef.current.mute();
        }
      } else if (isMuted) {
        setIsMuted(false);
        if (typeof playerRef.current.unMute === "function") {
          playerRef.current.unMute();
        }
      }
    } catch (error) {
      console.error("Error changing volume:", error);
    }
  };

  const setPlaybackSpeed = (speed: number) => {
    if (
      !playerRef.current ||
      isLoading ||
      typeof playerRef.current.setPlaybackRate !== "function"
    )
      return;

    try {
      playerRef.current.setPlaybackRate(speed);
      setPlaybackRate(speed);
    } catch (error) {
      console.error("Error setting playback speed:", error);
    }
  };

  // Format time (seconds to HH:MM:SS or MM:SS)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    } else {
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* YouTube player container */}
      <div
        ref={playerContainerRef}
        className="absolute inset-0 w-full h-full youtube-player-container"
      ></div>

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="text-red-500 text-center p-4">
            <div className="text-xl font-semibold mb-2">Error</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-40">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <div className="text-white font-medium">Loading video...</div>
          </div>
        </div>
      )}

      {/* Overlay to prevent clicking YouTube elements */}
      <div
        className="absolute inset-0 pointer-events-auto z-20"
        onClick={togglePlay}
      />

      {/* Big orange play button (visible when paused and not loading) */}
      {!isPlaying && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center transition-transform transform hover:scale-110"
          >
            <Play className="w-10 h-10 text-white fill-white" />
          </button>
        </div>
      )}

      {/* Video title */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent text-white font-medium z-10">
        {title}
      </div>

      {/* Controls */}
      {!error && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 transition-opacity duration-300 z-30 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress bar */}
          <Slider
            value={[currentTime ? (currentTime / duration) * 100 : 0]}
            onValueChange={handleSeek}
            disabled={isLoading}
            className="w-full mb-2 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-2 [&_[role=slider]]:border-white [&>span:first-child_span]:bg-orange-500"
          />

          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-white hover:bg-orange-500/20 disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>

            {/* Skip backward */}
            <Button
              onClick={() => {
                if (!playerRef.current || isLoading) return;
                try {
                  playerRef.current.seekTo(Math.max(0, currentTime - 10), true);
                } catch (error) {
                  console.error("Error seeking backward:", error);
                }
              }}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-white hover:bg-orange-500/20 disabled:opacity-50"
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            {/* Skip forward */}
            <Button
              onClick={() => {
                if (!playerRef.current || isLoading) return;
                try {
                  playerRef.current.seekTo(currentTime + 10, true);
                } catch (error) {
                  console.error("Error seeking forward:", error);
                }
              }}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-white hover:bg-orange-500/20 disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4" />
            </Button>

            {/* Time */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                disabled={isLoading}
                className="text-white hover:bg-orange-500/20 disabled:opacity-50"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                disabled={isLoading}
                className="w-16 [&>span:first-child]:h-1 [&>span:first-child]:bg-gray-600 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:w-2 [&_[role=slider]]:h-2 [&_[role=slider]]:border [&_[role=slider]]:border-white [&>span:first-child_span]:bg-orange-500"
              />
            </div>

            {/* Playback speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  className="text-white hover:bg-orange-500/20 disabled:opacity-50"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black/90 border-gray-700 text-white"
              >
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
                    } hover:bg-orange-500/10 focus:bg-orange-500/10`}
                  >
                    {speed === 1 ? "Normal" : `${speed}x`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="text-white hover:bg-orange-500/20 disabled:opacity-50"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
