// app/error.tsx (App Router)
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center  text-orange-800 px-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <AlertTriangle className="h-16 w-16 text-orange-600" />
        <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
        <p className="text-lg max-w-md">
          We hit a snag while loading the page. Don't worry — it's probably not
          your fault.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-lg border border-orange-600 text-orange-600 hover:bg-orange-100 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
