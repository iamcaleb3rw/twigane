import LessonView from "@/components/LessonView";
import YouTubePlayer from "@/components/Video";
import {
  GetCourseBySlugQueryResult,
  GetLessonByIdQueryResult,
} from "@/sanity.types";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { redirect } from "next/navigation";
import React from "react";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) => {
  const { slug, lessonSlug } = await params;

  const course: GetCourseBySlugQueryResult = await getCourseBySlug(slug);

  if (!course) {
    return redirect("/dashboard");
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
