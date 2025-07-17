import React from "react";
import InviteButton from "./InviteButton";
import Image from "next/image";
import Star from "@/public/star.svg";
import { Button } from "./ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <div className="px-6 py-6">
      <div className="w-full border flex justify-between  leading-tight min-h-[200px] rounded-lg bg-orange-500/80">
        <div className="py-8 px-4 flex gap-3 items-center w-full md:gap-0 justify-between">
          <div className="">
            <h1 className="text-background text-xl md:text-3xl tracking-tight font-bold">
              The future of learning <br /> doesn&apos;t need a classroom.
            </h1>
          </div>
          <Link href={"/dashboard"}>
            <Button
              size={"lg"}
              className="bg-black hover:bg-gray-900 hover:scale-[102%]"
            >
              Start Learning Today
            </Button>
          </Link>
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
    </div>
  );
};

export default CTASection;
