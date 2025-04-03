import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { auth, currentUser } from "@clerk/nextjs/server";

import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";

import CoursePageClient from "@/components/CoursePageClient";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const user = await currentUser();
  const { userId } = await auth();
  if (!userId) {
    return <div>You need to be logged in to view this page.</div>;
  }

  const course = await getCourseBySlug(slug);
  console.log(course?.modules?.at(0)?.lessons?.at(0)?.videoUrl);
  if (!course) {
    return <div>Course not found.</div>;
  }
  const isEnrolled = await isEnrolledInCourse(userId, course?._id);
  console.log(isEnrolled);

  return (
    <CoursePageClient isEnrolled={isEnrolled} course={course} user={user} />
  );
};

export default CoursePage;
