import React from "react";
import Badge from "./Badge";
import Link from "next/link";
import { Button } from "./ui/button";
import { GetCoursesQueryResult } from "@/sanity.types";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface CourseCardProps {
  course: GetCoursesQueryResult[number];
  progress: number;
  href: string;
}

const CourseCard = ({ course, href, progress }: CourseCardProps) => {
  const chapterLength = course.modules?.length ?? 0;
  return (
    <Link href={href} prefetch={false}>
      <div
        className="min-h-[430px] pb-2 border overflow-hidden rounded-2xl bg-white
    "
      >
        <div className="h-[55%] border-b p-2">
          {course.image && (
            <Image
              src={urlFor(course?.image).url() || ""}
              width={266}
              height={150}
              alt={course.title || "Course Image"}
              layout="responsive"
              className="border rounded-xl"
            />
          )}
        </div>
        <div className="p-3 space-y-2  h-[45%]">
          <h1 className="text-xl font-semibold tracking-tight">
            {course.title}
          </h1>
          <div>
            <p className="text-sm text-muted-foreground">
              {course.instructor?.name}
            </p>
          </div>

          <div className="flex gap-2 items-center mb-2 justify-between">
            <Badge
              text={course.grade}
              color="#ffff"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  color={"#000000"}
                  fill={"none"}
                >
                  <path
                    d="M1.99805 7.99928C1.99805 9.34126 10.0943 13 11.9857 13C13.8772 13 21.9734 9.34126 21.9734 7.99928C21.9734 6.6573 13.8772 2.99854 11.9857 2.99854C10.0943 2.99854 1.99805 6.6573 1.99805 7.99928Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.99219 11L7.24348 16.8002C7.32919 17.1975 7.52703 17.5687 7.85696 17.8054C10.0787 19.3998 13.8908 19.3998 16.1126 17.8054C16.4426 17.5687 16.6404 17.1975 16.7261 16.8002L17.9774 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.4774 9.49951V16.5006M20.4774 16.5006C19.6864 17.9471 19.3366 18.7221 18.9813 20.0011C18.9042 20.4562 18.9654 20.6855 19.2786 20.8891C19.4059 20.9718 19.5588 21.0012 19.7104 21.0012H21.229C21.3904 21.0012 21.5533 20.9675 21.6863 20.8757C21.9774 20.6747 22.0523 20.4541 21.9734 20.0011C21.662 18.8135 21.2653 18.0016 20.4774 16.5006Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
            <Badge
              text={`${chapterLength} chapters`}
              color="#ffff"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  color={"#000000"}
                  fill={"none"}
                >
                  <path
                    d="M2 15H15C15.9319 15 16.3978 15 16.7654 15.1522C17.2554 15.3552 17.6448 15.7446 17.8478 16.2346C18 16.6022 18 17.0681 18 18C18 18.9319 18 19.3978 17.8478 19.7654C17.6448 20.2554 17.2554 20.6448 16.7654 20.8478C16.3978 21 15.9319 21 15 21H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 3H15C15.9319 3 16.3978 3 16.7654 3.15224C17.2554 3.35523 17.6448 3.74458 17.8478 4.23463C18 4.60218 18 5.06812 18 6C18 6.93188 18 7.39782 17.8478 7.76537C17.6448 8.25542 17.2554 8.64477 16.7654 8.84776C16.3978 9 15.9319 9 15 9H2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 9H9C8.06812 9 7.60218 9 7.23463 9.15224C6.74458 9.35523 6.35523 9.74458 6.15224 10.2346C6 10.6022 6 11.0681 6 12C6 12.9319 6 13.3978 6.15224 13.7654C6.35523 14.2554 6.74458 14.6448 7.23463 14.8478C7.60218 15 8.06812 15 9 15H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 15C19.8954 15 19 13.6569 19 12C19 10.3431 19.8954 9 21 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 3C4.10457 3 5 4.34315 5 6C5 7.65685 4.10457 9 3 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 15C4.10457 15 5 16.3431 5 18C5 19.6569 4.10457 21 3 21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </div>
          <div>
            <Link href={"/"} className="mt-2">
              <Button className="w-full">Enroll</Button>
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
