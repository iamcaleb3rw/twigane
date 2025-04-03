import React from "react";
import YouTubePlayer from "./Video";
import useCourseStore from "@/app/store/useCourseStore";
import { Lesson } from "@/sanity.types";

interface LessonViewProps {
  initialLesson: any;
}
const LessonView = ({ initialLesson }: LessonViewProps) => {
  const activeLesson = useCourseStore((state) => state.activeLesson);
  const setActiveLesson = useCourseStore((state) => state.setActiveLesson);
  console.log(initialLesson);
  if (!activeLesson) {
    setActiveLesson(initialLesson);
  }
  return (
    <div>
      <YouTubePlayer url={activeLesson?.videoUrl ?? ""} />
      <div>{activeLesson?.description}</div>
    </div>
  );
};

export default LessonView;
