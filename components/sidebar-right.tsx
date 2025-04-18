"use client";
import * as React from "react";
import { useEffect, useState, Suspense } from "react";
import { Plus } from "lucide-react";

import { Modules } from "@/components/calendars";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useIsCoursePage } from "@/hooks/useIsCoursePage";
import { cn } from "@/lib/utils";
import useCourseStore from "@/app/store/useCourseStore";
import { Progress } from "./ui/progress";
import { getSidebarCourse } from "@/app/actions/course-actions";
import { GetSidebarInfoByIdQueryResult } from "@/sanity.types";
import { Skeleton } from "./ui/skeleton";
import { getCourseProgressAction } from "@/lib/sanityLessons";

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isCoursePage = useIsCoursePage();
  const courseId = useCourseStore((state) => state.course);
  const progressVersion = useCourseStore((state) => state.progressVersion);
  const [courseData, setCourseData] =
    useState<GetSidebarInfoByIdQueryResult | null>(null);
  const [courseProgress, setCourseProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) return;

        setIsLoading(true);

        // Fetch data in parallel
        const [courseInfo, progress] = await Promise.all([
          getSidebarCourse(courseId),
          getCourseProgressAction(courseId),
        ]);

        setCourseData(courseInfo);
        setCourseProgress(progress);
        alert(progress);
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, progressVersion]);

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "sticky hidden lg:flex top-0 h-svh border-l",
        !isCoursePage && "lg:hidden"
      )}
      {...props}
    >
      <SidebarHeader
        className={cn(
          "h-14 border-0 flex ",
          !isLoading && "flex items-center justify-center"
        )}
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
            {[1, 2, 3].map((moduleIndex) => (
              <div key={moduleIndex} className="space-y-4">
                <div className="h-4 w-1/2 bg-gray-200 rounded-full animate-pulse" />
                <div className="space-y-2 ml-3">
                  {[1, 2, 3].map((lessonIndex) => (
                    <div
                      key={lessonIndex}
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
              <>
                <Suspense fallback={<Skeleton className="h-6 w-full" />}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs">Course Progress</p>
                    <p className="text-xs">{Math.round(courseProgress)}%</p>
                  </div>
                  <Progress value={courseProgress} />
                </Suspense>
              </>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
