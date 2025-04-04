"use client";

import { usePathname } from "next/navigation";

export function useIsCoursePage() {
  const pathname = usePathname();

  // Match paths starting with /dashboard/courses/[slug] (including nested routes)
  const isCoursePage = /^\/dashboard\/courses\/[^/]+(\/.*)?$/.test(pathname);

  return isCoursePage;
}
