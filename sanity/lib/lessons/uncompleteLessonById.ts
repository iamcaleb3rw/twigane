// lib/unCompleteLessonAction.ts
import { client } from "../adminClient";
import { sanityFetch } from "../live";
import groq from "groq";

interface UncompleteLessonParams {
  lessonId: string;
  clerkId: string;
}

export async function uncompleteLessonById({
  lessonId,
  clerkId,
}: UncompleteLessonParams): Promise<boolean> {
  try {
    // 1. Fetch student document
    const student = await sanityFetch({
      query: groq`*[_type == "student" && clerkId == $clerkId][0] { _id }`,
      params: { clerkId },
    });

    if (!student?.data?._id) {
      console.error(`Student not found for Clerk ID: ${clerkId}`);
      return false;
    }
    const studentId = student.data._id;

    // 2. Find the specific completion record
    const completionQuery = groq`
      *[_type == "lessonCompletion" && 
        student._ref == $studentId && 
        lesson._ref == $lessonId
      ][0] { _id }
    `;

    const completion = await sanityFetch({
      query: completionQuery,
      params: { studentId, lessonId },
    });

    console.log("DELETION CANDIDATE:", completion);

    // 3. Validate and delete
    if (completion?.data?._id) {
      // Use the document ID for direct deletion
      await client.delete(completion.data._id);
      console.log("DELETION COMPLETED FOR DOC:", completion.data._id);
      return true;
    }

    // 4. Handle missing record appropriately
    console.warn(
      `No lesson completion found for student:${studentId} lesson:${lessonId}`
    );
    return false; // Changed to false for accurate feedback
  } catch (error) {
    console.error("Error uncompleting lesson:", error);
    return false;
  }
}
