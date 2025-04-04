import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getLessonBySlug(courseId: string, lessonSlug: string) {
  const getLessonBySlugQuery = defineQuery(`
    *[_type == "course" && _id == $courseId][0]{
      _id,
      title,
      "foundLesson": modules[]{
        title,
        "lesson": lessons[slug.current == $lessonSlug][0]
      }[defined(lesson)][0].lesson
    }
  `);

  const result = await sanityFetch({
    query: getLessonBySlugQuery,
    params: { courseId, lessonSlug },
  });

  return result.data?.foundLesson ?? null;
}
