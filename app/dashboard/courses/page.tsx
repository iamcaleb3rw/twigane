import { getCourses } from "@/sanity/lib/courses/getCourses";
import React from "react";

const Courses = async () => {
  const courses = await getCourses();
  console.log(courses[0].title);
  return <div>Courses</div>;
};

export default Courses;
