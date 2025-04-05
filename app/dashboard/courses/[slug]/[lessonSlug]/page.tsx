import LessonView from "@/components/LessonView";s
import {
  GetCourseBySlugQueryResult,
  GetLessonByIdQueryResult,
} from "@/sanity.types";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) => {
  const { slug, lessonSlug } = await params;
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const course: GetCourseBySlugQueryResult = await getCourseBySlug(slug);

  if (!course) {
    return redirect("/dashboard");
  }
  const isEnrolled = await isEnrolledInCourse(userId, course?._id);
  console.log(course.slug?.current);
  if (!isEnrolled) {
    return redirect(`/dashboard/courses/${course.slug?.current}`);
  }
  // 🔍 Find the lesson inside course.modules
  const lesson = course.modules
    ?.flatMap((module) => module.lessons || [])
    .find((lesson) => lesson.slug?.current === lessonSlug);

  console.log("✅ LESSON FOUND:", lesson);
  if (!lesson) {
    return redirect(`/dashboard/courses/${course.slug}`);
  }
  return (
    <div>
      <LessonView
        videoUrl={lesson.videoUrl ?? ""}
        description={lesson.description}
        course={course}
      />
    </div>
  );
};

export default LessonPage;
