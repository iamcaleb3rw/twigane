"use client";

import { useEffect, useState } from "react";
import { Search, Book } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

type CourseType = { name: string; subject: string };

/* ——— Demo data ——— */
const mockCourses: CourseType[] = [
  { name: "Algebra Basics", subject: "Mathematics" },
  { name: "Human Anatomy", subject: "Biology" },
  { name: "Intro to Economics", subject: "Business" },
];
const mockBooks = [
  { name: "Advanced Physics", subject: "Physics" },
  { name: "World History", subject: "History" },
  { name: "Organic Chemistry", subject: "Chemistry" },
];

/* ——— Fake queries that will rotate forever ——— */
const searchTerms = ["Math", "Physics", "History", "Biology"];

/* ——— Framer Motion helpers ——— */
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export default function SearchFeatureGrid() {
  const [query, setQuery] = useState<string>(""); // what appears in the bar
  const [loading, setLoading] = useState<boolean>(true); // when true → skeletons
  const [results, setResults] = useState<boolean>(false); // when true → show results

  /* ——— Animation loop ——— */
  useEffect(() => {
    let cancelled = false;

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const run = async () => {
      for (const term of searchTerms) {
        if (cancelled) return;

        /* 1️⃣  TYPE the word -------------------------------- */
        for (let i = 1; i <= term.length; i++) {
          setQuery(term.slice(0, i));
          await sleep(250);
        }

        /* 2️⃣  “SEARCHING” skeletons ------------------------ */
        setLoading(true);
        await sleep(900); // fake fetch delay
        setLoading(false);

        /* 3️⃣  Show results (fade‑in with stagger) ---------- */
        setResults(true);
        await sleep(2500); // keep results on screen

        /* 4️⃣  Begin deletion: hide results & show skeleton */
        setResults(false);
        setLoading(true);
        await sleep(350); // small pause before letters disappear

        for (let i = term.length - 1; i >= 0; i--) {
          setQuery(term.slice(0, i));
          await sleep(180);
        }

        /* Skeleton stays a beat, then we loop to next term */
        await sleep(600);
        setLoading(false);
      }

      /* ✨ Loop forever */
      if (!cancelled) run();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white rounded-[16px_0_0_0] min-h-[400px] absolute max-w-[800px] w-full shadow-lg">
      {/* ——— Search bar with typing text ——— */}
      <div className="p-3 flex gap-2 items-center text-sm text-muted-foreground">
        <Search size={16} />
        <span className="">
          {query || "Search resources..."}
          <span className="animate-pulse">|</span>
        </span>
      </div>
      <hr />

      {/* ——— Body ——— */}
      <div className="p-2">
        {loading ? (
          /* Skeletons while “searching” or “clearing” */
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : (
          /* Results fade in sequentially */
          <AnimatePresence>
            {results && (
              <motion.div
                key="results"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
              >
                {/* Courses */}
                <p className="ml-2 my-1 text-xs font-semibold text-muted-foreground">
                  Courses
                </p>
                <div className="ml-1 flex flex-col gap-1">
                  {mockCourses.map((course, idx) => (
                    <motion.div
                      key={idx}
                      variants={item}
                      className="flex gap-3 text-sm items-center"
                    >
                      <div className="bg-muted h-10 w-10 flex items-center justify-center font-semibold">
                        <span>{course.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p>{course.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {course.subject}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <hr className="my-2" />

                {/* Books */}
                <p className="ml-2 my-1 text-xs font-semibold text-muted-foreground">
                  Books
                </p>
                <div className="ml-1 flex flex-col gap-1">
                  {mockBooks.map((book, idx) => (
                    <motion.div
                      key={idx}
                      variants={item}
                      className="flex gap-3 text-sm items-center"
                    >
                      <div className="bg-muted h-10 w-10 flex items-center justify-center font-semibold">
                        <Book className="h-4 w-4" />
                      </div>
                      <div>
                        <p>{book.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {book.subject}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
