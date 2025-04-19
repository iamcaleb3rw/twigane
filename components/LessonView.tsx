"use client";
import React, { Suspense, useEffect } from "react";

import useCourseStore from "@/app/store/useCourseStore";
import { YouTubePlayer } from "./Video";
import { PortableText } from "next-sanity";
import { RichText } from "./RichText";
import { Skeleton } from "./ui/skeleton";
import CompleteButton from "./CompleteButton";

interface LessonView {
  videoUrl: string;
  description?: any;
  course: any;
  clerkId: string;
  lessonId: string;
}
const LessonView = ({
  videoUrl,
  description,
  course,
  clerkId,
  lessonId,
}: LessonView) => {
  console.log("Video file here", videoUrl);
  const setCourse = useCourseStore((state) => state.setCourse);
  useEffect(() => {
    if (course) {
      setCourse(course);
      console.log("Course set to Zustand store:", course.title);
    }
  }, [course, setCourse]);
  return (
    <div>
      {videoUrl && <YouTubePlayer youtubeUrl={videoUrl} />}
      <CompleteButton clerkId={clerkId} lessonId={lessonId} />
      <div className="mt-3 prose prose-blue dark:prose-invert max-w-none">
        <RichText value={description} />
      </div>
    </div>
  );
};

export default LessonView;
