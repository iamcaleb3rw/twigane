"use client";

import { useState, useEffect } from "react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { LineShadowText } from "@/components/magicui/line-shadow-text";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import Example from "@/components/Features";
import CourseGrid from "@/components/CourseGrid";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For progress tracking
  const [progress, setProgress] = useState(0); // For progress bar state
  const [isDashboardLoading, setIsDashboardLoading] = useState(false); // For dashboard navigation
  const [dashboardProgress, setDashboardProgress] = useState(0); // For dashboard progress
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate the loading progress when button is clicked
  const handleExploreCoursesClick = () => {
    setIsLoading(true);
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 10; // Increase progress
      });
    }, 500); // Increase every 500ms

    // Simulate the task being done
    setTimeout(() => {
      setIsLoading(false); // Stop loading once done
      setProgress(0); // Reset progress
    }, 5000); // Simulate a 5-second loading task
  };

  // Handle dashboard navigation with loading indicator
  const handleDashboardNavigation = () => {
    setIsDashboardLoading(true);
    const progressInterval = setInterval(() => {
      setDashboardProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 8; // Slightly slower progress
      });
    }, 400);

    // Simulate navigation delay then redirect
    setTimeout(() => {
      router.push("/dashboard"); // Navigate to dashboard

      // Reset states after navigation
      setTimeout(() => {
        setIsDashboardLoading(false);
        setDashboardProgress(0);
      }, 500); // Small delay after navigation
    }, 2500); // Simulate navigation delay
  };

  return (
    <div className="min-h-screen">
      <Navbar
        isScrolled={isScrolled}
        onDashboardClick={handleDashboardNavigation}
        isDashboardLoading={isDashboardLoading}
      />

      {/* Full-width progress bar - shows for either loading state */}
      {(isLoading || isDashboardLoading) && (
        <div className="fixed top-0 left-0 w-full bg-gray-200 h-1 z-50">
          <div
            className="h-full bg-lime-400 transition-all duration-300"
            style={{ width: `${isLoading ? progress : dashboardProgress}%` }}
          />
        </div>
      )}

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
          <p className="text-muted-foreground text-sm max-w-[400px] text-center">
            Forget cramming and endless notes—our platform brings interactive
            video courses that actually make sense
          </p>
        </div>

        <div>
          <ClerkLoading>
            <Skeleton className="w-[200px] h-[40px]"></Skeleton>
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <div className="flex gap-4">
                <Button
                  className="group"
                  size={"lg"}
                  onClick={handleExploreCoursesClick}
                >
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
              </div>
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
          </ClerkLoaded>
        </div>
      </div>

      {/* Add more content to enable scrolling */}
      <Example />
      <CourseGrid />
    </div>
  );
}
