"use server";

import { uncompleteLessonById } from "@/sanity/lib/lessons/uncompleteLessonById";

export async function uncompleteLessonAction(
  lessonId: string,
  clerkId: string
) {
  try {
    console.log("PARAMETERS", clerkId, lessonId);
    const result = await uncompleteLessonById({ lessonId, clerkId });
    console.log("UNCOMPLETE RESULT", result);
    return result;
  } catch (err) {
    console.log("Failed Uncompleting Lesson", err);
  }
}
