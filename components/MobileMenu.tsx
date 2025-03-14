"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Home, Loader2, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { navLinks } from "./Navbar";
import Link from "next/link";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

const MobileMenu = () => {
  const router = useRouter();
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);
  const handleDashboardNavigation = () => {
    setIsDashboardLoading(true);
    // Simulate navigation delay then redirect
    setTimeout(() => {
      router.push("/dashboard"); // Navigate to dashboard

      // Reset states after navigation
      setTimeout(() => {
        setIsDashboardLoading(false);
      }, 500); // Small delay after navigation
    }, 2500); // Simulate navigation delay
  };
  return (
    <div className="sm:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger className="border p-1 rounded-sm shadow-sm bg-white">
          <Menu strokeWidth={1.6} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {navLinks.map((link) => (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="flex items-center gap-2">
                <Home strokeWidth={1} />
                <p>{link.label}</p>
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div>
            <ClerkLoading>
              <Skeleton className="w-[140px] h-[32px]"></Skeleton>
              <Skeleton className="w-[38px] aspect-square rounded-full" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <div className="flex gap-2 items-center">
                  <Link href="/dashboard" className="">
                    <Button
                      variant={"outline"}
                      className="text-xs shadow-none text-muted-foreground"
                      onClick={handleDashboardNavigation}
                      disabled={isDashboardLoading}
                    >
                      {isDashboardLoading && (
                        <Loader2 className="animate-spin" />
                      )}
                      Go to dashboard
                    </Button>
                  </Link>
                  <UserButton />
                </div>
              </SignedIn>
              <SignedOut>
                <SignUpButton
                  mode="modal"
                  signInForceRedirectUrl={"/dashboard"}
                >
                  <Button>Sign Up</Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline">Log In</Button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileMenu;
