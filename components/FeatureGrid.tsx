"use client";
import React, { useRef } from "react";
import MyFlow from "./MyFlow";
import Tabs from "./Tabs";
import SearchFeatureGrid from "./SearchFeature";
import { ChartAreaGradient } from "./chart-area-gradient";
import Preview from "./GravityDemo";
import Lottie from "lottie-react";
import { DotPattern } from "./magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import CreditCard from "./CreditCard";
import CreditCardStack from "./CreditCard";
import InviteButton from "./InviteButton";
import { GridPattern } from "./magicui/grid-pattern";
import FriendAnimation from "@/public/colleague.json";

type CourseType = {
  name: string;
  subject: string;
};
const FeatureGrid = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const mockCourses = [
    {
      name: "Maclaurin series",
      subject: "Mathematics",
    },
    {
      name: "Random varibles",
      subject: "Mathematics",
    },
    {
      name: "Projectile Motion",
      subject: "Physics",
    },
  ];
  const mockBooks = [
    {
      name: "Mathematics Senior 1",
      subject: "Mathematics",
    },
    {
      name: "Mathematics Senior 4",
      subject: "Mathematics",
    },
    {
      name: "Physics Senior 3",
      subject: "Physics",
    },
  ];
  return (
    <div className="mt-16 p-1 md:p-8 ">
      <div className="text-center">
        <p className="text-3xl font-semibold tracking-tight ">
          Everything You Need to Own Your Studies
        </p>
        <p className="text-muted-foreground">
          Features that make studying less boring and a lot more effective.
        </p>
      </div>
      <div className="grid grid-cols-12 grid-rows-12 min-h-screen gap-2">
        <div className="col-span-12 md:col-span-7 min-h-[300px] rounded-md shadow-sm   row-span-4 border">
          <div className="">
            <div className="flex items-center border-b font-semibold">
              <div className="flex gap-2 p-3">
                <div className="h-3 w-3 bg-red-600 rounded-full" />
                <div className="h-3 w-3 bg-green-500 rounded-full" />
                <div className="h-3 w-3 bg-amber-500 rounded-full" />
              </div>
              <div className="w-1 h-5 rounded-full bg-muted-foreground/30 mr-2" />
              <p>Reduce Tab Madness</p>
            </div>
            <Tabs />
          </div>
          <div className="p-1">
            <MyFlow />
          </div>
        </div>
        <div className="bg-gradient-to-br relative pointer-events-none from-orange-500 via-purple-500 to-fuchsia-500 col-span-12 overflow-hidden p-8 sm:col-span-6 md:col-span-5 min-h-[300px] rounded-md shadow-sm row-span-4 border">
          <p className="text-white text-center text-2xl tracking-tight">
            Easy to find what you need
          </p>
          <SearchFeatureGrid />
        </div>
        <div className="col-span-12 flex items-center flex-col justify-between overflow-hidden sm:col-span-6 md:col-span-5 min-h-[350px] rounded-md shadow-sm row-span-4 border">
          <p className="h-[10%] text-muted-foreground w-full p-3">
            <span className="font-semibold text-foreground">
              Get better grades
            </span>{" "}
            one clear lesson, one solid win at a time{" "}
            <em>without losing your mind</em>
          </p>
          <div className="flex-col h-[90%]  flex items-center justify-center  w-full">
            <ChartAreaGradient />
          </div>
        </div>

        <div className="col-span-12 pointer-events-none relative overflow-hidden md:col-span-7 min-h-[250px] rounded-md shadow-sm row-span-4 border">
          <Preview />
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(250px_circle_at_center,white,transparent)]"
            )}
          />
        </div>
        <div className="col-span-12 px-8 pt-8 relative overflow-hidden sm:col-span-6 min-h-[250px] rounded-md shadow-sm flex flex-col gap-4  row-span-4 border">
          <div>
            <h1 className="text-2xl font-semibold">
              Bring your friends on board
            </h1>
            <p className="text-muted-foreground">
              Why go it alone when you can level up with your crew?
            </p>
          </div>

          <InviteButton />
          <div className="w-[220px] h-[220px] overflow-hidden">
            <div className="scale-[1.5] -translate-x-10 -translate-y-5">
              <Lottie
                animationData={FriendAnimation}
                loop
                autoplay
                className=""
              />
            </div>
          </div>

          <GridPattern
            width={30}
            height={30}
            x={-1}
            y={-1}
            strokeDasharray={"4 2"}
            className={cn(
              "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
            )}
          />
        </div>
        <div
          className="text-yellow-400 col-span-12 sm:col-span-6 min-h-[250px] rounded-md shadow-sm row-span-4 border overflow-hidden relative flex flex-col justify-between items-center pt-6"
          ref={ref}
        >
          <p className=" text-center z-30">
            We support local payment options like
            <br />
            <span className="mt-16 text-xl p-4">MTN MoMo</span>
          </p>
          <CreditCardStack />
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(250px_circle_at_center,white,transparent)]"
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FeatureGrid;
