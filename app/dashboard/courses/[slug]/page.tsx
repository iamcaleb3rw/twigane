import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import CoursePageClient from "@/components/CoursePageClient";
import { redirect } from "next/navigation";

export const revalidate = 60;

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/"); // 🏃‍♂️ No user, go home immediately
  }

  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!course) {
    redirect("/dashboard"); // 🏃‍♂️ No course found
  }

  const isEnrolled = await isEnrolledInCourse(userId, course._id);

  // ✅ If the user is already enrolled, redirect to first lesson immediately
  const firstUrl = course?.modules?.[0]?.lessons?.[0]?.slug?.current;
  if (isEnrolled && course.slug?.current && firstUrl) {
    redirect(`/dashboard/courses/${course.slug.current}/${firstUrl}`);
  }

  // ✅ If not enrolled, render the course page
  return (
    <CoursePageClient
      isEnrolled={isEnrolled}
      course={course}
      user={email} // You can pass user's email if you fetch it separately
      firstUrl={firstUrl}
    />
  );
};

export default CoursePage;
