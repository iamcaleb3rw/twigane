"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { completeLessonAction } from "@/lib/completeLessonAction";
import { getCompletionStatusAction } from "@/lib/getCompletionStatusAction";
import { uncompleteLessonAction } from "@/lib/unCompleteLessonAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useCourseStore from "@/app/store/useCourseStore";

type CompleteButtonProps = {
  clerkId: string;
  lessonId: string;
};

const CompleteButton = ({ clerkId, lessonId }: CompleteButtonProps) => {
  const incrementProgressVersion = useCourseStore(
    (state) => state.incrementProgressVersion
  );
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<boolean | undefined>();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const lessonStatus = await getCompletionStatusAction(lessonId, clerkId);
        setStatus(lessonStatus);
      } catch (error) {
        console.error("Fetching Status Failed:", error);
        toast.error("Failed to fetch lesson completion status.");
      }
    };

    getStatus();
  }, [lessonId, clerkId]);

  const handleCompletion = async () => {
    setIsLoading(true);
    try {
      let successMessage = "";
      let errorMessage = "";
      let newStatus: boolean | undefined;

      if (status === false) {
        const result = await completeLessonAction(clerkId, lessonId);
        if (result?._id) {
          successMessage = "Lesson completed successfully!";
          newStatus = true;
        } else {
          errorMessage = "Lesson Completion Failed!";
          newStatus = false;
        }
      } else {
        const result = await uncompleteLessonAction(lessonId, clerkId);
        if (result) {
          successMessage = "Removed completion successfully!";
          newStatus = false;
        } else {
          errorMessage = "Failed to remove completion!";
          newStatus = true;
        }
      }

      if (successMessage) {
        toast.success(successMessage);
        setStatus(newStatus);
        incrementProgressVersion();
      } else if (errorMessage) {
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      disabled={isLoading}
      onClick={handleCompletion}
      className="w-full mt-3"
    >
      {isLoading
        ? "Loading..."
        : status === true
          ? "Uncomplete Lesson"
          : "✔️ Complete Lesson"}
    </Button>
  );
};

export default CompleteButton;
