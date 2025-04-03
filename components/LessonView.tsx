import React from "react";
import YouTubePlayer from "./Video";
import useCourseStore from "@/app/store/useCourseStore";
import { Lesson } from "@/sanity.types";

const LessonView = () => {
  const activeLesson = useCourseStore((state) => state.activeLesson);
  const setActiveLesson = useCourseStore((state) => state.setActiveLesson);

  return (
    <div>
      <YouTubePlayer url={activeLesson?.videoUrl ?? ""} />
      <div>{activeLesson?.description}</div>
    </div>
  );
};

export default LessonView;
