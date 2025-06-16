"use client";

import { Home, GraduationCap, Book, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/courses",
      icon: GraduationCap,
      label: "Courses",
      active: pathname.startsWith("/dashboard/courses"),
    },
    {
      href: "/dashboard/textbooks",
      icon: Book,
      label: "Books",
      active: pathname.startsWith("/dashboard/textbooks"),
    },
    {
      href: "/dashboard/pastpapers",
      icon: ClipboardList,
      label: "Solutions",
      active: pathname.startsWith("/dashboard/pastpapers"),
    },
  ];

  return (
    <nav className="fixed bottom-0 z-50 w-full bg-white border-t shadow-sm md:hidden safe-area-inset-bottom">
      <ul className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label, active }) => (
          <li
            key={href}
            className="w-full h-full flex flex-col items-center p-2 justify-center"
          >
            <Link
              href={href}
              className={clsx(
                "flex flex-col items-center",
                active
                  ? "text-background rounded-xl bg-primary h-full w-full flex items-center justify-center font-medium"
                  : "text-muted-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
