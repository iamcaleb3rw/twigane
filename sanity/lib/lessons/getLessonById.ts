import { defineQuery } from "groq";
import { sanityFetch } from "../live";

export async function getCourseByIdAndLessonSlug(
  slug: string,
  lessonSlug: string
) {
  const getCourseByIdAndLessonSlugQuery = defineQuery(`
    *[_type == "course" && slug.current == $slug][0]{
      _id,
      title,
      modules[]{
        _key,
        title,
        lessons[slug.current == $lessonSlug][0]{
          _id,
          title,
          slug,
          content
        }
      }
    }
  `);

  const result = await sanityFetch({
    query: getCourseByIdAndLessonSlugQuery,
    params: { slug, lessonSlug },
  });

  return result.data;
}
