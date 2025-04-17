import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { auth } from "@clerk/nextjs/server";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import CoursePageClient from "@/components/CoursePageClient";
import { redirect } from "next/navigation";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/"); // ⬅️ Early return, no need to wait for anything else
  }

  const course = await getCourseBySlug((await params).slug);
  if (!course) {
    return redirect("/dashboard");
  }

  const isEnrolled = await isEnrolledInCourse(userId, course._id);
  const firstUrl = course?.modules?.[0]?.lessons?.[0]?.slug?.current;
  const email = undefined; // You can optionally skip `currentUser()` if email isn't critical

  return (
    <CoursePageClient
      isEnrolled={isEnrolled}
      course={course}
      user={email}
      firstUrl={firstUrl}
    />
  );
};

export default CoursePage;
