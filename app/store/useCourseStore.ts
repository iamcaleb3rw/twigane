"use client";
import { GetCourseBySlugQueryResult, Lesson } from "@/sanity.types";
import { create } from "zustand";

// Import the existing type
// Adjust import based on the actual location

type CourseStore = {
  course: GetCourseBySlugQueryResult | null | any;
  progressVersion: number;
  activeLesson: Lesson | null;
  incrementProgressVersion: () => void;
  setActiveLesson: (lesson: Lesson) => void;
  setCourse: (course: GetCourseBySlugQueryResult) => void;
};

const useCourseStore = create<CourseStore>((set) => ({
  course: null,
  activeLesson: null,
  progressVersion: 0,
  incrementProgressVersion: () =>
    set((state) => ({
      progressVersion: state.progressVersion + 1,
    })),
  setActiveLesson: (lesson) => set({ activeLesson: lesson }),
  setCourse: (course) =>
    set({
      course,
      activeLesson: course?.modules?.[0]?.lessons?.[0] || null,
    }),
}));

export default useCourseStore;
