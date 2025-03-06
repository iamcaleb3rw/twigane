import React from "react";
import CourseCard from "./CourseCard";

const CourseGrid = () => {
  return (
    <div className=" py-40 border-t flex gap-5 flex-col bg-muted px-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Explore our top courses
        </h1>
        <p className="text-muted-foreground text-sm">
          Dive into our curated list of courses and increase your knowledge with
          hands-on practical learning.
        </p>
      </div>
      <div className="grid  lg:grid-cols-2 xl:grid-cols-3 gap-3 "></div>
    </div>
  );
};

export default CourseGrid;
