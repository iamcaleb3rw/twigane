"use client";

import { useState, useEffect } from "react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar isScrolled={isScrolled} />
      <div className="relative flex flex-col gap-4 h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-20 mt-16">
        <AnimatedGridPattern
          className={cn("inset-x-0 inset-y-[-30%] h-[200%]")}
        />
        <div className="flex items-center flex-col gap-4">
          <h1 className="tracking-tighter text-foreground/95 max-w-[600px] text-center text-6xl font-bold">
            Why{" "}
            <span className="line-through italic font-medium">memorize</span>{" "}
            when you can actually <br />
            <LineShadowText
              className="italic text-lime-400"
              shadowColor={"#a3e635"}
            >
              Understand
            </LineShadowText>
            ?
          </h1>
          <UserButton />
          <p className="text-muted-foreground text-sm max-w-[400px] text-center">
            Forget cramming and endless notes—our platform brings interactive
            video courses that actually make sense
          </p>
        </div>

        <div>
          <SignedIn>
            <Button className="group" size={"lg"}>
              <span>Explore courses</span>
              <span className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={30}
                  height={30}
                  fill={"none"}
                >
                  <path
                    d="M16.5 7.5L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 6.18791C8 6.18791 16.0479 5.50949 17.2692 6.73079C18.4906 7.95209 17.812 16 17.812 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button className="group" size={"lg"}>
              <span>Get Started</span>
              <span className="group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={30}
                  height={30}
                  fill={"none"}
                >
                  <path
                    d="M16.5 7.5L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 6.18791C8 6.18791 16.0479 5.50949 17.2692 6.73079C18.4906 7.95209 17.812 16 17.812 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Button>
          </SignedOut>
        </div>
      </div>
      {/* Add more content to enable scrolling */}
      <div className="h-[100px]"></div>
    </div>
  );
}
