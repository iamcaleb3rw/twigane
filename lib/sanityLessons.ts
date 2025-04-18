// src/lib/sanityLessons.ts
"use server";

import { completeLessonById } from "@/sanity/lib/lessons/completeLessonById";
import { getLessonCompletionStatus } from "@/sanity/lib/lessons/getLessonCompletionStatus";
import { uncompleteLessonById } from "@/sanity/lib/lessons/uncompleteLessonById";

// Type definitions
interface LessonStatusResult {
  success: boolean;
  isCompleted?: boolean;
  error?: string;
}

interface ToggleResult extends LessonStatusResult {
  isCompleted?: boolean;
}

export async function toggleLessonCompletion(
  lessonId: string,
  clerkId: string
): Promise<ToggleResult> {
  try {
    const isCompleted = await getLessonCompletionStatus(lessonId, clerkId);

    if (isCompleted) {
      await uncompleteLessonById({ lessonId, clerkId });
    } else {
      await completeLessonById({ lessonId, clerkId });
    }

    return { success: true, isCompleted: !isCompleted };
  } catch (error) {
    console.error("Completion toggle failed:", error);
    return { success: false, error: "Failed to update lesson status" };
  }
}

export async function checkLessonStatus(
  lessonId: string,
  clerkId: string
): Promise<LessonStatusResult> {
  try {
    const isCompleted = await getLessonCompletionStatus(lessonId, clerkId);
    return { success: true, isCompleted };
  } catch (error) {
    console.error("Status check failed:", error);
    return { success: false, error: "Failed to fetch lesson status" };
  }
}
