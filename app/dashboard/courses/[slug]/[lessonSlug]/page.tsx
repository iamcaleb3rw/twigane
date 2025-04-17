import LessonView from "@/components/LessonView";
import {
  GetCourseIdBySlugQueryResult,
  GetLessonBySlugQueryResult,
} from "@/sanity.types";
import getCourseIdBySlug from "@/sanity/lib/courses/getCourseIdBySlug";
import { getCourseByIdAndLessonSlug } from "@/sanity/lib/lessons/getLessonById";
import { getLessonBySlug } from "@/sanity/lib/lessons/getLessonBySlug";

import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const revalidate = 300;
export const runtime = "edge";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) => {
  const { slug, lessonSlug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/");

  // 1. Fetch course metadata + specific lesson in one go
  const cidRes: GetCourseIdBySlugQueryResult = await getCourseIdBySlug(slug);
  const courseId = cidRes?._id;
  if (!courseId) redirect("/dashboard");

  const lesson: GetLessonBySlugQueryResult = await getLessonBySlug(lessonSlug);
  const lessonTitle = lesson?.title;
  const videoUrl = lesson?.videoUrl;
  const content = lesson?.content;
  const lessonId = lesson?._id; // 2. Check enrollment in parallel with any other needed calls
  const isEnrolled = await isEnrolledInCourse(userId, courseId);
  if (!isEnrolled) redirect(`/dashboard/courses/${slug}`);

  return (
    <LessonView
      videoUrl={videoUrl ?? ""}
      description={content}
      course={courseId}
    />
  );
};

export default LessonPage;
