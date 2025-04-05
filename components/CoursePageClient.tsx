"use client";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import Divider from "./Divider";
import Image from "next/image";
import CourseTimeline from "./course-timeline";
import { DotPattern } from "./magicui/dot-pattern";
import { GetCourseBySlugQueryResult } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import PayButton from "./PayButton";
import { cn } from "@/lib/utils";
import Logo from "@/public/logo.svg";
import { User } from "@clerk/nextjs/server";
import useCourseStore from "@/app/store/useCourseStore";
import LessonView from "./LessonView";
import { useRouter } from "next/navigation";

interface CoursePageClientProps {
  course: GetCourseBySlugQueryResult;
  isEnrolled: boolean;
  user: string | undefined;
  firstUrl: string | undefined;
}

const CoursePageClient = ({
  user,
  course,
  isEnrolled,
  firstUrl,
}: CoursePageClientProps) => {
  const router = useRouter();
  const setCourse = useCourseStore((state) => state.setCourse);
  const zustandCourse = useCourseStore((state) => state.course);

  // Set course to Zustand store
  useEffect(() => {
    if (course) {
      setCourse(course);
      console.log("Course set to Zustand store:", course.title);
    }
  }, [course, setCourse]);

  // Handle redirect after state update
  useEffect(() => {
    if (isEnrolled && course?.slug?.current && firstUrl) {
      console.log("Redirecting to first lesson:", firstUrl);
      router.push(`/dashboard/courses/${course.slug.current}/${firstUrl}`);
    }
  }, [isEnrolled, course?.slug?.current, firstUrl, router]);

  // Return null if redirecting to prevent flash of content
  if (isEnrolled) {
    return null;
  }

  return (
    <div>
      <div className="w-full overflow-hidden flex items-center justify-center border rounded-lg aspect-[16/5] relative mb-4">
        <h1 className="text-3xl font-bold">{course?.title}</h1>
        <DotPattern
          glow={true}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
          )}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-3 lg:col-span-2">
          <CourseTimeline course={course} />
        </div>

        <div className="col-span-3 lg:col-span-1 h-fit border rounded-lg">
          <div className="border-b p-2 flex items-center gap-2">
            <div>
              {course?.instructor?.photo && (
                <Image
                  src={
                    urlFor(course?.instructor.photo).url() || "/placeholder.svg"
                  }
                  alt={course.instructor.name || "Instructor Photo"}
                  width={50}
                  height={50}
                  className="inline-block rounded-full border border-gray-200"
                />
              )}
            </div>
            <div className="">
              <p>{course?.instructor?.name}</p>
              <p className="text-xs text-muted-foreground">Instructor</p>
            </div>
          </div>
          <div className="p-2">
            {course && course.price && (
              <PayButton
                amount={course.price}
                currency="RWF"
                email={user}
                title={course?.title}
                description="Pay for this course"
                logoUrl={Logo}
                slug={`${course.slug?.current}`}
              />
            )}
            <Divider />
            <Button variant={"secondary"} className="w-full text-xs">
              Unlock all courses for 5$/Month
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePageClient;
