"use server";

import { getLessonCompletionStatus } from "@/sanity/lib/lessons/getLessonCompletionStatus";

export async function getCompletionStatusAction(
  lessonId: string,
  clerkId: string
) {
  try {
    console.log("Recieved params", clerkId, lessonId);
    const result = await getLessonCompletionStatus(lessonId, clerkId);
    console.log("STATUS", result);
    return result;
  } catch {
    console.log("Error Getting completion statud");
  }
}
