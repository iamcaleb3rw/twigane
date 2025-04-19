"use server";
import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";
export type LessonCompletionResult = {
  _id: string;
  completedAt: string; // ISO date string
  student: {
    _ref: string;
    _type: "reference";
  };
  _createdAt: string;
  module: {
    _ref: string;
    _type: "reference";
  };
  _rev: string;
  _updatedAt: string;
  _type: "lessonCompletion";
  lesson: {
    _ref: string;
    _type: "reference";
  };
};

export async function completeLessonAction(clerkId: string, lessonId: string) {
  try {
    const result: LessonCompletionResult = await completeLessonById({
      clerkId,
      lessonId,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.log("Error completing lesson");
  }
}
