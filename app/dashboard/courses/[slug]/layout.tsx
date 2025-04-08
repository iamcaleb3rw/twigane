import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";

export default async function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  // Update the Zustand store with the fetched course

  return <>{children}</>;
}
