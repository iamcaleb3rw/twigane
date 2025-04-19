"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { completeLessonAction } from "@/lib/completeLessonAction";
import { getCompletionStatusAction } from "@/lib/getCompletionStatusAction";
import { uncompleteLessonAction } from "@/lib/unCompleteLessonAction";
import { toast } from "sonner";

type CompleteButtonProps = {
  clerkId: string;
  lessonId: string;
};

const CompleteButton = ({ clerkId, lessonId }: CompleteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<boolean | undefined>();
  useEffect(() => {
    const getStatus = async () => {
      try {
        const lessonStatus = await getCompletionStatusAction(lessonId, clerkId);
        setStatus(lessonStatus);
      } catch {
        alert("Fetching Status Failed");
      }
    };
    getStatus();
  }, [lessonId, clerkId]);

  const handleCompletion = async () => {
    setIsLoading(true);
    try {
      if (status === false) {
        const result = await completeLessonAction(clerkId, lessonId);
        if (result?._id) {
          toast.success("Lesson completed!!");
          setStatus(true);
        } else {
          alert("Lesson Completion Failed!!");
        }
      } else {
        const result = await uncompleteLessonAction(lessonId, clerkId);
        if (result === true) {
          toast.success("Removed completion successfully!");
          setStatus(false);
        } else {
          alert("Failed to remove completion!");
        }
      }
    } catch {
      alert("Something went wrong!!!");
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
