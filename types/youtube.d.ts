interface Window {
  YT: {
    Player: any;
    PlayerState: {
      BUFFERING: number;
      PLAYING: number;
      PAUSED: number;
      ENDED: number;
    };
  };
  onYouTubeIframeAPIReady: () => void;
}
