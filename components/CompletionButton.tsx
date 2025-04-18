import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { toggleLessonCompletion, checkLessonStatus } from "@/lib/sanityLessons";
import useConfetti from "@/lib/confetti";
import { Button } from "./ui/button";
import useCourseStore from "@/app/store/useCourseStore";

type CompletionButtonProps = {
  lessonId: string;
  clerkId: string;
};

const CompletionButton = ({ lessonId, clerkId }: CompletionButtonProps) => {
  const incProgressVersion = useCourseStore(
    (state) => state.incrementProgressVersion
  );
  const { shootFireworks } = useConfetti();
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialLoad = useRef(true);

  // Fetch initial completion status
  useEffect(() => {
    const fetchStatus = async () => {
      if (!clerkId) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await checkLessonStatus(lessonId, clerkId);
        if (result.success) {
          setIsCompleted(result.isCompleted ?? false);
          setError(null);
        } else {
          setError(result.error ?? "Failed to load status");
        }
      } catch (err) {
        setError("Connection error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [lessonId, clerkId]);

  const handleCompletionToggle = async () => {
    if (!clerkId || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await toggleLessonCompletion(lessonId, clerkId);

      if (result.success) {
        const newCompletedState = result.isCompleted ?? false;
        setIsCompleted(newCompletedState);
        incProgressVersion();

        // Trigger confetti only when marking as complete
        if (newCompletedState) {
          shootFireworks();
        }
      } else {
        setError(result.error ?? "Update failed");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!clerkId)
    return (
      <div className="text-gray-500 flex items-center gap-2">
        🔒 Sign in to track progress
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <Button
        onClick={handleCompletionToggle}
        disabled={isLoading}
        size={"sm"}
        className={`
          px-6 py-3 mt-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2
          ${
            isCompleted
              ? "bg-red-500/30 border border-red-500 text-foreground hover:bg-red-600/30"
              : "bg-green-500/90 hover:bg-green-600 text-white"
          }
          ${isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-[1.01]"}
          shadow-lg hover:shadow-md transition-all duration-200
        `}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : isCompleted ? (
          " Mark as Incomplete"
        ) : (
          "✅ Mark as Complete"
        )}
      </Button>

      {error ? (
        <div className="text-red-500 text-sm flex items-center gap-2 animate-fade-in">
          ⚠️ {error}
        </div>
      ) : (
        <div className="text-gray-600 dark:text-gray-300 text-sm">
          {isCompleted ? (
            <span className="flex items-center gap-2">
              🎓 Lesson completed!
            </span>
          ) : (
            "📚 Complete this lesson to track progress"
          )}
        </div>
      )}
    </div>
  );
};

export default CompletionButton;
