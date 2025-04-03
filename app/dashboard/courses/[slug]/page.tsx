import CourseTimeline from "@/components/course-timeline";
import Divider from "@/components/Divider";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { urlFor } from "@/sanity/lib/image";
import { FileStack } from "lucide-react";

import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import PayButton from "@/components/PayButton";
import Logo from "@/public/logo.svg";
import ReactPlayer from "react-player";
import { isEnrolledInCourse } from "@/sanity/lib/student/isEnrolledInCourse";
import Video from "@/components/Video";
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

  return <CoursePageClient isEnrolled={isEnrolled} course={course} />;
};

export default CoursePage;
