"use client";
import { GetCourseBySlugQueryResult, Lesson } from "@/sanity.types";
import { create } from "zustand";

// Import the existing type
// Adjust import based on the actual location

type CourseStore = {
  course: GetCourseBySlugQueryResult | null | any;
  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson) => void;
  setCourse: (course: GetCourseBySlugQueryResult) => void;
};

const useCourseStore = create<CourseStore>((set) => ({
  course: null,
  activeLesson: null,
  setActiveLesson: (lesson) => set({ activeLesson: lesson }),
  setCourse: (course) =>
    set({
      course,
      activeLesson: course?.modules?.[0]?.lessons?.[0] || null,
    }),
}));

export default useCourseStore;
