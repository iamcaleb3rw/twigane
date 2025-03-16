import CourseTimeline from "@/components/course-timeline";
import Divider from "@/components/Divider";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import getCourseBySlug from "@/sanity/lib/courses/getCourseBySlug";
import { urlFor } from "@/sanity/lib/image";
import { FileStack } from "lucide-react";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import PayButton from "@/components/PayButton";
import Logo from "@/public/logo.svg";

const CoursePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const user = await currentUser();
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
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <CourseTimeline course={course} />
        </div>

        <div className="col-span-1 h-fit border rounded-lg ">
          <div className="border-b p-2 flex items-center gap-2">
            <div>
              {course?.instructor?.photo && (
                <Image
                  src={
                    urlFor(course?.instructor.photo).url() || "/placeholder.svg"
                  }
                  alt={course.instructor.name || "Instructor Photo"}
                  width={50}
                  height={50}
                  className="inline-block  rounded-full border border-gray-200"
                />
              )}
            </div>

            <div className="">
              <p>{course?.instructor?.name}</p>
              <p className="text-xs text-muted-foreground">Instructor</p>
            </div>
          </div>
          <div className="p-2">
            <PayButton
              amount={course?.price}
              currency="RWF"
              email={user?.primaryEmailAddress?.emailAddress}
              title={course?.title}
              description="Pay for this course"
              logoUrl={Logo}
            />
            <Divider />
            <Button variant={"secondary"} className="w-full">
              Unlock all courses for 5$/Month
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
