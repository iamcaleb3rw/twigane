import CoursesGrid from "@/components/CourseGrid";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import React from "react";

const Courses = async () => {
  const courses = await getCourses();
  return (
    <div>
      <div>
        <div>
          <p className="text-xl font-semibold">Filters</p>
        </div>
        <div className="flex gap-2 w-full">
          <div className="p-2 border   w-full rounded-full">Grade</div>
          <div className="p-2 border  w-full rounded-full">Term</div>
          <div className="p-2 border  w-full rounded-full">Subject</div>
          <div className="p-2 border  w-full rounded-full">Sort By</div>
        </div>
      </div>
      <CoursesGrid courses={courses} />
    </div>
  );
};

export default Courses;
