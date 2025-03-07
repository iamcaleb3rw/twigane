import Link from "next/link";
import type { GetCoursesQueryResult } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Badge } from "./ui/badge";
import { BookOpenTextIcon, Play } from "lucide-react";
import { Progress } from "./ui/progress";

interface CourseCardProps {
  course: GetCoursesQueryResult[number];
  progress: number;
  href: string;
}

const CourseCard = ({ course, href, progress }: CourseCardProps) => {
  const chapterLength = course.modules?.length ?? 0;
  return (
    <Link href={href} prefetch={false}>
      <div className="border min-h-[300px] flex flex-col justify-between bg-muted/40 rounded-xl overflow-hidden transition-shadow p-2">
        <div className="relative aspect-video w-full p-1 border rounded-md overflow-hidden">
          {course.image ? (
            <Image
              src={urlFor(course.image).url() || "/placeholder.svg"}
              alt={course.title || "Course Thumbnail"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-muted w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          <Badge className="absolute top-1 right-1">{course.grade}</Badge>
          <div className="absolute top-[40%] left-[45%] rounded-full p-3  bg-primary">
            <Play className="" stroke="#fff" fill="#fff" />
          </div>
        </div>
        <div className="mt-2 flex gap-2 flex-col">
          <div className="text-[17px] font-semibold line-clamp-1">
            {course.title}
          </div>
          <div className="line-clamp-2 text-muted-foreground text-xs">
            {course.description}
          </div>
          <div className="flex items-center gap-1">
            {course.instructor?.photo && (
              <Image
                src={
                  urlFor(course.instructor.photo).url() || "/placeholder.svg"
                }
                alt={course.instructor.name || "Instructor Photo"}
                width={20}
                height={20}
                className="inline-block w-6 h-6 rounded-full border border-gray-200"
              />
            )}
            <p className="text-xs text-muted-foreground">
              By {course.instructor?.name}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-orange-200/30 w-fit px-3 py-1 rounded-xl border border-orange-500">
            <BookOpenTextIcon strokeWidth={1.2} size={20} />
            <p className="text-sm">
              {course.modules?.length}{" "}
              {course.modules?.length === 1 ? "Chapter" : "Chapters"}
            </p>
          </div>
          <div>
            <Progress value={30} />
          </div>
          <p>{course.bundle}</p>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
