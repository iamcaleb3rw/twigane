import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { auth, currentUser } from "@clerk/nextjs/server";

import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";

import CoursePageClient from "@/components/CoursePageClient";
import { redirect } from "next/navigation";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await getCourseBySlug(slug);
  console.log(course?.modules?.at(0)?.lessons?.at(0)?.slug?.current);
  const firstUrl = course?.modules?.at(0)?.lessons?.at(0)?.slug?.current;
  if (!course) {
    return <div>Course not found.</div>;
  }
  const isEnrolled = await isEnrolledInCourse(userId, course?._id);
  console.log(isEnrolled);

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
