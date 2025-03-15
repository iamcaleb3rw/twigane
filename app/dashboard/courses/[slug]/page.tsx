import CourseTimeline from "@/components/course-timeline";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { urlFor } from "@/sanity/lib/image";
import { FileStack } from "lucide-react";
import Image from "next/image";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const chapterLength = course?.modules?.length;
  return (
    <div>
      <div className="w-full overflow-hidden flex items-center justify-center border rounded-lg aspect-[16/5] relative mb-4">
        <h1 className="text-3xl font-bold ">{course?.title}</h1>
        <DotPattern
          glow={true}
          className={cn(
            "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
          )}
        />
      </div>
      <div>
        <CourseTimeline />
      </div>
    </div>
  );
};

export default CoursePage;
