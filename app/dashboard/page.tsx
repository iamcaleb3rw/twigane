import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Star from "@/public/star.svg";
import React from "react";
import CourseCard from "@/components/CourseCard";
import { currentUser } from "@clerk/nextjs/server";
import { Component } from "@/components/Chart";
import { getCourses } from "@/sanity/lib/courses/getCourses";

const HomePage = async () => {
  const user = await currentUser();
  const courses = await getCourses();
  return (
    <div>
      <div className="w-full border flex justify-between  leading-tight min-h-[200px] rounded-lg bg-orange-500/80">
        <div className="py-8 px-8 flex flex-col justify-between">
          <h1 className="text-background/80 text-sm">TWIGANE LEARNING</h1>
          <h1 className="text-background text-3xl tracking-tight font-bold">
            The future of learning <br /> doesn&apos;t need a classroom.
          </h1>
          <div className="bg-foreground hover:scale-[101%] transition-transform cursor-pointer rounded-full h-10 text-background max-w-[270px] p-1">
            <div className="w-full h-full bg-foregorund flex justify-between items-center rounded-full">
              <p className="ml-3">Invite other students</p>
              <span className="rounded-full bg-background text-foreground h-full aspect-square flex items-center justify-center">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2  overflow-hidden relative">
          <Image src={Star} alt="Star Image" className="opacity-20" />
          <Image
            src={Star}
            alt="Star Image"
            width={40}
            className="opacity-40 "
          />
          <Image
            src={Star}
            alt="Star Image"
            width={70}
            className="opacity-30"
          />
          <Image
            src={Star}
            alt="Star Image"
            width={100}
            className="opacity-40 translate-y-5"
          />
        </div>
      </div>
      <div className="mt-2">
        <h1 className="text-xl font-bold">Continue watching</h1>
        <hr />
        <div className="grid grid-cols-3 gap-3 mt-3">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              progress={20}
              href={`/dashboard/courses/${course.slug}`}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="border p-2">
          Welcome back <span>{user?.firstName}</span>
        </div>
        <div>
          <Component />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
