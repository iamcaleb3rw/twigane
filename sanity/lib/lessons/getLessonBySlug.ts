import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getLessonBySlug(lessonSlug: string) {
  const getLessonBySlugQuery = defineQuery(`
    *[_type == "lesson" && slug.current == $lessonSlug][0]{
      _id,
      title,
      content,
      videoUrl,
    }
  `);

  const result = await sanityFetch({
    query: getLessonBySlugQuery,
    params: { lessonSlug },
  });

  return result.data ?? null;
}
