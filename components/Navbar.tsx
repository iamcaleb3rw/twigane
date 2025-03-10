import { cn } from "@/lib/utils";
import Link from "next/link";
import Logo from "@/public/logo.svg";
import Image from "next/image";
import { Button } from "./ui/button";
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
import { Loader2 } from "lucide-react";

interface NavbarProps {
  isScrolled: boolean;
  onDashboardClick?: () => void;
  isDashboardLoading: boolean;
}

export default function Navbar({
  isScrolled,
  onDashboardClick,
  isDashboardLoading,
}: NavbarProps) {
  return (
    <nav
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-50 border transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-background/60 backdrop-blur-md top-1 px-0 shadow-md py-2 w-[600px] rounded-2xl"
          : "bg-background py-3 w-full"
      )}
    >
      <div className="px-2 flex items-center justify-between transition-all duration-300 ease-in-out">
        <Link href="/" className="text-2xl font-bold">
          <Image src={Logo} alt="Logo" width={35} />
        </Link>
        <div className="space-x-4">
          <Link href="#" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary ">
            Courses
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>
        </div>
        <div className="flex gap-2">
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
                    onClick={onDashboardClick}
                    disabled={isDashboardLoading}
                  >
                    {isDashboardLoading && <Loader2 className="animate-spin" />}
                    Go to dashboard
                  </Button>
                </Link>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignUpButton mode="modal" signInForceRedirectUrl={"/dashboard"}>
                <Button>Sign Up</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button variant="outline">Log In</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </nav>
  );
}
