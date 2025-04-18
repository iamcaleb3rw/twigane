import groq from "groq";
import { client } from "../adminClient";
import { sanityFetch } from "../live";

export async function completeLessonById({
  lessonId,
  clerkId,
}: {
  lessonId: string;
  clerkId: string;
}) {
  try {
    // Combined query with projections
    const query = groq`{
      "student": *[_type == "student" && clerkId == $clerkId][0] { _id },
      "existingCompletion": *[_type == "lessonCompletion" 
        && student._ref == ^.student._id 
        && lesson._ref == $lessonId][0],
      "lesson": *[_type == "lesson" && _id == $lessonId][0] {
        "module": *[_type == "module" && ^._id in lessons[]._ref][0] {
          _id,
          "course": *[_type == "course" && ^._id in modules[]._ref][0]._id
        }
      }
    }`;

    const { data } = await sanityFetch({
      query,
      params: { lessonId, clerkId },
    });

    if (!data?.student?._id) throw new Error("Student not found");
    if (data.existingCompletion) return data.existingCompletion;

    if (!data.lesson?.module?._id || !data.lesson.module.course) {
      throw new Error("Could not find module or course for lesson");
    }

    return await client.create(
      {
        _type: "lessonCompletion",
        student: { _type: "reference", _ref: data.student._id },
        lesson: { _type: "reference", _ref: lessonId },
        module: { _type: "reference", _ref: data.lesson.module._id },
        course: { _type: "reference", _ref: data.lesson.module.course },
        completedAt: new Date().toISOString(),
      },
      {
        autoGenerateArrayKeys: true,
        skipCrossDatasetReferenceValidation: true,
      }
    );
  } catch (error) {
    console.error("Error completing lesson:", error);
    throw error;
  }
}
