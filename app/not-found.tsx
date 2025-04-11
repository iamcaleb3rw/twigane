import Logo from "@/public/logo.svg";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navbar Section */}
      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-center mx-auto">
          <div className="flex items-center space-x-2">
            <Image src={Logo} width={40} alt="Logo" />
            <span className="font-semibold text-foreground">Twigane X LMS</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-[4rem]">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              404
            </h1>
            <p className="text-lg text-muted-foreground">
              This page does not exist
            </p>
            <p className="text-sm text-muted-foreground">
              Sorry, we couldn't find the page you're looking for.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              Courses
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>

            <Link
              href="/dashboard/textbooks"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Textbooks
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2  bg-background hover:underline h-10 px-4 py-2"
            >
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
