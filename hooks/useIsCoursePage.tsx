"use client";

import { usePathname } from "next/navigation";

export function useIsCoursePage() {
  const pathname = usePathname();

  // Match paths like /dashboard/courses/[slug]/[lessonSlug]
  const isCoursePage = /^\/dashboard\/courses\/[^/]+\/[^/]+$/.test(pathname);

  return isCoursePage;
}
