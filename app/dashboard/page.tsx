import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Star from "@/public/star.svg";
import React from "react";
import CourseCard from "@/components/CourseCard";
import { currentUser } from "@clerk/nextjs/server";
import { Component } from "@/components/Chart";
import { getCourses } from "@/sanity/lib/courses/getCourses";
import CoursesGrid from "@/components/CourseGrid";
import InviteButton from "@/components/InviteButton";
import Stats from "@/components/Stats";

const HomePage = async () => {
  const [user, courses] = await Promise.all([currentUser(), getCourses()]);
  return (
    <div>
      <div className="w-full border flex justify-between  leading-tight min-h-[200px] rounded-lg bg-orange-500/80">
        <div className="py-8 px-4 md:px-8 flex flex-col gap-3 md:gap-0 justify-between">
          <h1 className="text-background/80 text-xs sm:text-sm">
            TWIGANE LEARNING
          </h1>
          <h1 className="text-background text-xl md:text-3xl tracking-tight font-bold">
            The future of learning <br /> doesn&apos;t need a classroom.
          </h1>
          <InviteButton />
        </div>
        <div className="hidden md:grid grid-cols-2  overflow-hidden relative">
          <Image
            src={Star}
            alt="Star Image"
            className="opacity-20"
            loading="lazy"
          />
          <Image
            src={Star}
            alt="Star Image"
            width={40}
            className="opacity-40 "
            loading="lazy"
          />
          <Image
            src={Star}
            alt="Star Image"
            width={70}
            loading="lazy"
            className="opacity-30"
          />
          <Image
            src={Star}
            alt="Star Image"
            width={100}
            className="opacity-40 translate-y-5"
            loading="lazy"
          />
        </div>
      </div>
      <div className="mt-2">
        <h1 className="text-lg md:text-xl font-bold">Continue watching</h1>
        <hr />
        <CoursesGrid courses={courses} />
      </div>
      <div className="md:grid grid-cols-2 gap-2">
        <div className="hidden md:block border p-2">
          Welcome back <span>{user?.firstName}</span>
        </div>
        <div>
          <Component />
        </div>
      </div>
      <p className="h-screen bg-orange-500">Yoooo</p>
    </div>
  );
};

export default HomePage;
