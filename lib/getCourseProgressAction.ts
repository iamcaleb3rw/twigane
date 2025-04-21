"use server";
import { ProgressQueryResult } from "@/sanity.types";
import { getCourseProgress } from "@/sanity/lib/lessons/getCourseProgress";

export async function getCourseProgressAction(
  clerkId: string,
  courseId: string
) {
  try {
    const result = await getCourseProgress(clerkId, courseId);
    console.log("PARAMS PROGRESS", clerkId, courseId);
    console.log("RESULT PROGRESS ACTION", result);
    return result.courseProgress;
  } catch {
    console.log("ERROR GETTING PROGRESS");
  }
}
