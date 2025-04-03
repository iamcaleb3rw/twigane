"use client";
import * as React from "react";
import { Plus } from "lucide-react";

import { Modules } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useIsCoursePage } from "@/hooks/useIsCoursePage";
import { cn } from "@/lib/utils";
import useCourseStore from "@/app/store/useCourseStore";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function SidebarRight({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const isCoursePage = useIsCoursePage();
  const course = useCourseStore((state) => state.course);

  return (
    <Sidebar
      collapsible="none"
      className={cn(
        "sticky hidden lg:flex top-0 h-svh border-l",
        !isCoursePage && "lg:hidden"
      )}
      {...props}
    >
      <SidebarHeader className="h-14 border-0 flex items-center justify-center">
        <p className="text-lg font-bold line-clamp-1">{course?.title}</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator className="mx-0" />
        <Modules course={course} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>{isCoursePage ? "Yooo" : "noooo"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
