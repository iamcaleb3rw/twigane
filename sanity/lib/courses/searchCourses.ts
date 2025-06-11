import { defineQuery } from "groq";
import { sanityFetch } from "../live";
import { revalidatePath } from "next/cache";

export async function searchCourses(term: string) {
  const searchQuery = defineQuery(`*[_type == "course" && (
    title match $term + "*" ||
    description match $term + "*" ||
    category->name match $term + "*"
  )] {
    title,
    description,
    "slug": slug.current,
    "category": category->{...},
    "instructor": instructor->{...}
  }`);

  const result = await sanityFetch({
    query: searchQuery,
    params: { term },
  });
  revalidatePath("/dashboard/courses");
  return result.data || [];
}
