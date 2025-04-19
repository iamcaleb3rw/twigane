"use client";

import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useCourseStore from "@/app/store/useCourseStore";
import { getSidebarCourse } from "@/app/actions/course-actions";
import { getCourseProgressAction } from "@/lib/sanityLessons";
import { GetSidebarInfoByIdQueryResult } from "@/sanity.types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Modules } from "@/components/calendars";
import { useIsCoursePage } from "@/hooks/useIsCoursePage";

export default function SidebarRight() {
  const pathname = usePathname();
  const isCoursePage = useIsCoursePage();
  const courseId = useCourseStore((state) => state.course);
  const courseProgress = useCourseStore((state) => state.progress);

  const [courseData, setCourseData] =
    useState<GetSidebarInfoByIdQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      try {
        const [courseInfo, progress] = await Promise.all([
          getSidebarCourse(courseId),
          getCourseProgressAction(courseId),
        ]);
        setCourseData(courseInfo);
        useCourseStore.getState().setProgress(progress);
      } catch (err) {
        console.error("Failed to load sidebar course info", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId, pathname]);

  if (!isCoursePage) return null;

  return (
    <Sidebar
      collapsible="none"
      className={cn("sticky top-0 hidden lg:flex h-svh border-l")}
    >
      <SidebarHeader
        className={cn("h-14", !isLoading && "flex items-center justify-center")}
      >
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <p className="text-lg font-bold line-clamp-1">{courseData?.title}</p>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        {isLoading ? (
          <div className="space-y-6 px-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2 ml-3">
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-3 w-3/4 bg-gray-200 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Modules course={courseData} />
        )}
      </SidebarContent>

      <SidebarSeparator className="mx-0" />
      <SidebarFooter className="py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoading ? (
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-3 w-8 bg-gray-200 rounded-full animate-pulse" />
                </div>
                <div className="h-2 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ) : (
              <Suspense fallback={<Skeleton className="h-6 w-full" />}>
                <div className="flex justify-between items-center">
                  <p className="text-xs">Course Progress</p>
                  <p className="text-xs">{Math.round(courseProgress)}%</p>
                </div>
                <Progress value={courseProgress} />
              </Suspense>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
