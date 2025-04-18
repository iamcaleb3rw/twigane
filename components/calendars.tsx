"use client";
import * as React from "react";
import { Check, ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  GetCourseBySlugQueryResult,
  GetSidebarInfoByIdQueryResult,
  Lesson,
  Module,
} from "@/sanity.types";
import useCourseStore from "@/app/store/useCourseStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import path from "path";
interface ModulesProps {
  course: GetSidebarInfoByIdQueryResult;
}
export function Modules({ course }: ModulesProps) {
  const activeLesson = useCourseStore((state) => state.activeLesson);
  const pathname = usePathname();
  const setActiveLesson = useCourseStore((state) => state.setActiveLesson);
  console.log(activeLesson?.videoUrl);
  return (
    <>
      {course?.modules?.map((module, index) => (
        <React.Fragment key={module.title}>
          <SidebarGroup key={module.title} className="py-0">
            <Collapsible
              defaultOpen={index === 0}
              className="group/collapsible"
            >
              <SidebarGroupLabel
                asChild
                className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <CollapsibleTrigger>
                  {module.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {module.lessons?.map((item, index) => {
                      return (
                        <Link
                          href={`/dashboard/courses/${course.slug?.current}/${item.slug?.current}`}
                          key={item.title}
                        >
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              className={cn(
                                "hover:bg-primary/5",
                                item.slug?.current &&
                                  pathname.includes(item.slug.current) &&
                                  "bg-primary/10 border border-primary"
                              )}
                            >
                              <div data-active={index < 2}>
                                <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-green-300 to-green-500 shadow-inner shadow-green-600 ring-1 ring-green-300"></span>
                              </div>
                              <p className="text-xs"> {item.title}</p>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </Link>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
          <SidebarSeparator className="mx-0" />
        </React.Fragment>
      ))}
    </>
  );
}
