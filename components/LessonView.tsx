"use client";
import React, { useEffect } from "react";

import useCourseStore from "@/app/store/useCourseStore";
import { GetCourseBySlugQueryResult } from "@/sanity.types";
import { YouTubePlayer } from "./Video";

interface LessonView {
  videoUrl: string;
  description?: any;
  course: any;
}
const LessonView = ({ videoUrl, description, course }: LessonView) => {
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
      <div>{description}</div>
    </div>
  );
};

export default LessonView;
