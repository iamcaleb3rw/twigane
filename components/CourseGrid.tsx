import { cn } from "@/lib/utils";
import CourseCard, { CourseCardProps } from "./CourseCard";

interface CoursesGridProps {
  courses: CourseCardProps["course"][];
  className?: string;
}

const CoursesGrid = ({ courses, className }: CoursesGridProps) => {
  return (
    <div
      className={cn(
        "relative mt-2",
        // Hide scrollbar for cleaner look (optional - requires CSS)
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
        className
      )}
    >
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 overflow-x-auto md:overflow-visible pb-4">
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex-shrink-0 w-[80vw] md:w-auto md:flex-shrink md:flex-grow"
          >
            <CourseCard
              course={course}
              href={`/courses/${course.slug}`}
              progress={0} // Replace with actual progress if needed
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesGrid;
