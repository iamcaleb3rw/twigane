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
interface ModulesProps {
  course: GetSidebarInfoByIdQueryResult;
}
export function Modules({ course }: ModulesProps) {
  const activeLesson = useCourseStore((state) => state.activeLesson);
  const setActiveLesson = useCourseStore((state) => state.setActiveLesson);
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
                    {module.lessons?.map((item, index) => (
                      <Link
                        href={`/dashboard/courses/${course.slug?.current}/${item.slug?.current}`}
                        key={item.title}
                      >
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <div
                              data-active={index < 2}
                              className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                            >
                              <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                            </div>
                            <p className="text-xs"> {item.title}</p>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </Link>
                    ))}
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
