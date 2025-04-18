import { useEffect, useRef } from "react";

type ConfettiOptions = {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  origin?: { x: number; y: number };
  ticks?: number;
  zIndex?: number;
};

const useConfetti = () => {
  const confettiRef = useRef<typeof import("canvas-confetti") | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("canvas-confetti").then((mod) => {
        confettiRef.current = mod.default;
      });
    }
  }, []);

  const shoot = (options: ConfettiOptions) => {
    if (typeof window === "undefined" || !confettiRef.current) return;

    confettiRef.current({
      ...options,
      zIndex: 9999,
    });
  };

  const shootFireworks = () => {
    if (typeof window === "undefined" || !confettiRef.current) return;

    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      origin: { y: 0.6 },
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        document.querySelectorAll("canvas").forEach((c) => c.remove());
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confettiRef.current?.({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * 0.3 + 0.2, y: Math.random() * 0.2 },
      });
    }, 250);
  };

  return { shoot, shootFireworks };
};

export default useConfetti;
