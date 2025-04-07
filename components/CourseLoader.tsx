"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");

  useEffect(() => {
    // Simulate loading progress
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress((prev) => {
          const increment = Math.floor(Math.random() * 10) + 1;
          const newProgress = Math.min(prev + increment, 100);

          // Update loading text based on progress
          if (newProgress > 75) {
            setLoadingText("Almost there...");
          } else if (newProgress > 50) {
            setLoadingText("Loading resources...");
          } else if (newProgress > 25) {
            setLoadingText("Hang on....");
          }

          return newProgress;
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Loading course</h1>
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>

        <div className="space-y-2">
          <Progress value={progress} className="h-2 w-full" />
          <p className="text-right text-sm text-muted-foreground">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  );
}
