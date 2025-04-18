"use client";
import { GetCourseBySlugQueryResult, Lesson } from "@/sanity.types";
import { progress } from "framer-motion";
import { create } from "zustand";

// Import the existing type
// Adjust import based on the actual location

type CourseStore = {
  course: GetCourseBySlugQueryResult | null | any;
  progress: number;
  activeLesson: Lesson | null;
  setProgress: (progress: number) => void;
  setActiveLesson: (lesson: Lesson) => void;
  setCourse: (course: GetCourseBySlugQueryResult) => void;
};

const useCourseStore = create<CourseStore>((set) => ({
  course: null,
  activeLesson: null,
  progress: 0,
  setProgress: (progress: number) => set({ progress }),
  setActiveLesson: (lesson) => set({ activeLesson: lesson }),
  setCourse: (course) =>
    set({
      course,
      activeLesson: course?.modules?.[0]?.lessons?.[0] || null,
    }),
}));

export default useCourseStore;
