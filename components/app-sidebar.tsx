"use client";

import * as React from "react";
import {
  Bot,
  Frame,
  UserRound,
  GraduationCap,
  Map,
  PieChart,
  Route,
  Settings2,
  SquareTerminal,
  Cog,
  UsersRound,
  BookOpenText,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/20/solid";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "My learning",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: GraduationCap,
    },
    {
      title: "Textbooks",
      url: "/dashboard/textbooks",
      icon: BookOpenText,
    },
    {
      title: "AI Solver",
      url: "/dashboard/ai",
      icon: Bot,
    },
  ],
  projects: [
    {
      name: "Referalls",
      url: "#",
      icon: UsersRound,
    },
    {
      name: "Settings",
      url: "#",
      icon: Cog,
    },
    {
      name: "Profile",
      url: "#",
      icon: UserRound,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
