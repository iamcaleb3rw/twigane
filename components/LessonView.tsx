"use client";
import React, { useEffect } from "react";
import YouTubePlayer from "./Video";
import useCourseStore from "@/app/store/useCourseStore";
import { GetCourseBySlugQueryResult } from "@/sanity.types";

interface LessonView {
  videoUrl: string;
  description?: string;
  course: GetCourseBySlugQueryResult;
}
const LessonView = ({ videoUrl, description, course }: LessonView) => {
  const setCourse = useCourseStore((state) => state.setCourse);
  useEffect(() => {
    if (course) {
      setCourse(course);
      console.log("Course set to Zustand store:", course.title);
    }
  }, [course, setCourse]);
  return (
    <div>
      {videoUrl && <YouTubePlayer url={videoUrl} />}
      <div>{description}</div>
    </div>
  );
};

export default LessonView;
