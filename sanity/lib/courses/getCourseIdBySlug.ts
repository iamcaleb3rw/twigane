import { sanityFetch } from "../live";
import { defineQuery } from "groq";
import { cache } from "react";

async function getCourseIdBySlug(slug: string) {
  const getCourseIdBySlugQuery =
    defineQuery(`*[_type == "course" && slug.current == $slug][0] {
    _id,

  }`);

  const course = await sanityFetch({
    query: getCourseIdBySlugQuery,
    params: { slug },
  });

  return course.data;
}

export default getCourseIdBySlug;
