import Image from "next/image";
import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import CourseCard from "../CourseCard";
import {
  GetCourseByIdQueryResult,
  GetCoursesQueryResult,
} from "@/sanity.types";

export default function CourseGrid({ courses }: { courses: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {courses.map((course: GetCoursesQueryResult[number]) => (
        <CourseCard
          key={course._id}
          course={course}
          progress={32}
          href={`/dashboard/courses/${course.slug}`}
        />
      ))}
    </div>
  );
}
