import LessonView from "@/components/LessonView";
import getCourseIdBySlug from "@/sanity/lib/courses/getCourseIdBySlug";
import { getLessonBySlug } from "@/sanity/lib/lessons/getLessonBySlug";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const LessonPage = async ({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) => {
  const { slug, lessonSlug } = await params;
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Kick off both fetches in parallel
  const courseIdPromise = getCourseIdBySlug(slug);
  const lessonPromise = getLessonBySlug(lessonSlug);

  const courseId = (await courseIdPromise)?._id;
  if (!courseId) redirect("/dashboard");

  // Start enrollment check as soon as we have the ID
  const enrolledPromise = isEnrolledInCourse(userId, courseId);
  const lesson = await lessonPromise;
  if (!lesson) redirect(`/dashboard/courses/${slug}`);

  if (!(await enrolledPromise)) {
    redirect(`/dashboard/courses/${slug}`);
  }

  // We know lesson is non-null and has the fields we need
  return (
    <LessonView
      videoUrl={lesson.videoUrl!}
      description={lesson.content}
      course={courseId}
      clerkId={userId}
      lessonId={lesson._id}
    />
  );
};

export default LessonPage;
