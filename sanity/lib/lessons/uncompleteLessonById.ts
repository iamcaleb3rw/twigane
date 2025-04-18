import { client } from "../adminClient";
import groq from "groq";

interface UncompleteLessonParams {
  lessonId: string;
  clerkId: string;
}

export async function uncompleteLessonById({
  lessonId,
  clerkId,
}: UncompleteLessonParams) {
  // Combined query to directly find and delete the lesson completion
  await client.delete({
    query: groq`
      *[_type == "lessonCompletion" 
      && lesson._ref == $lessonId 
      && student->clerkId == $clerkId][0]
    `,
    params: { lessonId, clerkId },
  });
}
