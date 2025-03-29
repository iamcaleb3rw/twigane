"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Volume1,
  Volume,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface YouTubePlayerProps {
  url: string;
  title?: string;
}

export default function YouTubePlayer({
  url,
  title = "Video Player",
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  };

  const videoId = getYouTubeId(url);

  useEffect(() => {
    // Load YouTube API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player(playerRef.current!, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          cc_load_policy: 0, // Disable closed captions
          fs: 0, // Disable fullscreen button
          origin: window.location.origin,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      setPlayer(newPlayer);
    };

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    const playerInstance = event.target;
    setDuration(playerInstance.getDuration());
    setVolume(playerInstance.getVolume());

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Create new interval for time updates
    intervalRef.current = setInterval(() => {
      if (playerInstance) {
        try {
          const currentTime = playerInstance.getCurrentTime() || 0;
          const duration = playerInstance.getDuration() || 1;
          setCurrentTime(currentTime);
          setProgress((currentTime / duration) * 100);
        } catch (error) {
          console.error("Error updating time:", error);
        }
      }
    }, 100);
  };

  const onPlayerStateChange = (event: any) => {
    // Update playing state
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);

    // Update buffering state
    setIsBuffering(event.data === window.YT.PlayerState.BUFFERING);

    // If video ended, set ended state
    if (event.data === window.YT.PlayerState.ENDED) {
      setVideoEnded(true);
      setCurrentTime(0);
      setProgress(0);
    } else {
      setVideoEnded(false);
    }
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const toggleMute = () => {
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setVolume(player.getVolume());
    } else {
      player.mute();
    }
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!player) return;
    const newVolume = value[0];
    player.setVolume(newVolume);
    setVolume(newVolume);
    if (newVolume === 0) {
      player.mute();
      setIsMuted(true);
    } else if (isMuted) {
      player.unMute();
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (!player) return;
    const seekTime = (value[0] / 100) * duration;
    player.seekTo(seekTime, true);
    setCurrentTime(seekTime);
    setProgress(value[0]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Get volume icon based on volume level
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-5 w-5" />;
    if (volume < 30) return <Volume className="h-5 w-5" />;
    if (volume < 70) return <Volume1 className="h-5 w-5" />;
    return <Volume2 className="h-5 w-5" />;
  };

  // Restart video
  const restartVideo = () => {
    if (!player) return;
    player.seekTo(0, true);
    player.playVideo();
    setVideoEnded(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!player) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "m":
          toggleMute();
          break;
        case "f":
          toggleFullscreen();
          break;
        case "ArrowRight":
          player.seekTo(currentTime + 5, true);
          break;
        case "ArrowLeft":
          player.seekTo(currentTime - 5, true);
          break;
        case "ArrowUp":
          const newVolumeUp = Math.min(volume + 10, 100);
          player.setVolume(newVolumeUp);
          setVolume(newVolumeUp);
          if (isMuted) {
            player.unMute();
            setIsMuted(false);
          }
          break;
        case "ArrowDown":
          const newVolumeDown = Math.max(volume - 10, 0);
          player.setVolume(newVolumeDown);
          setVolume(newVolumeDown);
          if (newVolumeDown === 0) {
            player.mute();
            setIsMuted(true);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, currentTime, volume, isMuted]);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Handle click outside for volume slider
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const volumeButton = document.querySelector("[data-volume-button]");
      const volumeSlider = document.querySelector("[data-volume-slider]");

      if (
        showVolumeSlider &&
        volumeSlider &&
        volumeButton &&
        !volumeSlider.contains(event.target as Node) &&
        !volumeButton.contains(event.target as Node)
      ) {
        setShowVolumeSlider(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVolumeSlider]);

  // Add CSS to hide YouTube annotations and end screens
  useEffect(() => {
    // Create a style element
    const style = document.createElement("style");
    style.innerHTML = `
      .ytp-pause-overlay,
      .ytp-endscreen-content,
      .ytp-ce-element,
      .ytp-ce-covering-overlay,
      .ytp-ce-covering-image,
      .ytp-ce-expanding-image,
      .ytp-ce-element.ytp-ce-channel.ytp-ce-channel-this,
      .ytp-ce-element.ytp-ce-video.ytp-ce-element-show,
      .ytp-ce-element.ytp-ce-element-show {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-lg overflow-hidden bg-black"
      tabIndex={0}
    >
      {/* Title bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
        <h2 className="text-white font-medium truncate">{title}</h2>
      </div>

      {/* YouTube iframe (hidden controls) */}
      <div className="absolute inset-0 w-full h-full">
        <div id="youtube-player" className="w-full h-full">
          <iframe
            ref={playerRef}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&disablekb=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&playsinline=1&cc_load_policy=0&fs=0&origin=${window.location.origin}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        </div>
      </div>

      {/* Custom play overlay - only shown when paused */}
      {!isPlaying && !isBuffering && !videoEnded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="rounded-full bg-orange-500 p-5 transform transition-transform hover:scale-110">
            <Play className="h-12 w-12 text-white fill-white" />
          </div>
        </div>
      )}

      {/* Video ended overlay */}
      {videoEnded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
          <h3 className="text-white text-xl font-medium mb-4">Video ended</h3>
          <Button
            onClick={restartVideo}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Watch Again
          </Button>
        </div>
      )}

      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Custom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        {/* Progress bar */}
        <Slider
          value={[progress]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={handleSeek}
          className="mb-2 [&>span:first-child]:h-1.5 [&>span:first-child]:bg-orange-200/30 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-orange-500"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Play/Pause button */}
            <Button
              onClick={togglePlay}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-orange-500/20 h-9 w-9"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Volume control with slider */}
            <div className="relative flex items-center">
              <Button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-orange-500/20 h-9 w-9"
                data-volume-button
              >
                {getVolumeIcon()}
              </Button>

              {showVolumeSlider && (
                <div
                  className="absolute bottom-full left-0 mb-2 bg-black/80 p-2 rounded-md w-32 z-30"
                  data-volume-slider
                >
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={handleVolumeChange}
                    className="[&>span:first-child]:h-1.5 [&>span:first-child]:bg-orange-200/30 [&_[role=slider]]:bg-orange-500 [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-orange-500"
                  />
                </div>
              )}
            </div>

            {/* Time display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Fullscreen button */}
          <Button
            onClick={toggleFullscreen}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-orange-500/20 h-9 w-9"
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
