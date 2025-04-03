import useCourseStore from "@/app/store/useCourseStore";
import { GetCourseBySlugQueryResult } from "@/sanity.types";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
// Your API fetching function

// Import the existing type
// Adjust path

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Access Zustand's store method

  // Fetch the course and make sure it matches the GetCourseBySlugQueryResult type
  const course: GetCourseBySlugQueryResult = await getCourseBySlug(slug);

  // Update the Zustand store with the fetched course

  return <>{children}</>;
}
