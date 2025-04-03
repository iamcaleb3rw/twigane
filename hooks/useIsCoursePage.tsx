"use client";

import { usePathname } from "next/navigation";

export function useIsCoursePage() {
  const pathname = usePathname();

  // Match the format: /dashboard/courses/{id}
  const isCoursePage = /^\/dashboard\/courses\/[^/]+$/.test(pathname);

  return isCoursePage;
}
