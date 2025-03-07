import { getCourses } from "@/sanity/lib/courses/getCourses";
import React from "react";

const Courses = async () => {
  const courses = await getCourses();

  return <div>Courses</div>;
};

export default Courses;
