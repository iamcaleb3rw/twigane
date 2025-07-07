"use client";

import type React from "react";
import { useEffect, useState, useTransition, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { searchForCourses } from "@/app/actions/course-actions";
import { debounce } from "lodash";

// Skeleton loading component
function SearchSkeleton() {
  return (
    <div className="space-y-2 p-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse mb-1" />
            <div className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Initialize query from URL params
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setQuery(currentQuery);
  }, [searchParams]);

  // Create debounced search function
  const executeSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length > 2) {
        try {
          const searchResults = await searchForCourses(searchQuery);
          setResults(searchResults);
        } catch (error) {
          console.error("Error searching courses:", error);
          setResults([]);
        }
      } else {
        setResults([]);
      }
    }, 300),
    []
  );

  // Handle input changes
  const handleInputChange = (value: string) => {
    setQuery(value);
    startTransition(() => {
      executeSearch(value);
    });
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "query") params.set(key, value);
    });

    if (query) params.set("query", query);
    params.set("page", "1");

    router.push(`/dashboard/courses?${params.toString()}`);
  };

  // Handle selecting a course
  const handleSelect = useCallback(
    (courseSlug: string) => {
      setOpen(false);
      router.push(`/dashboard/courses/${courseSlug}`);
    },
    [router]
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search courses..."
          className="w-full pl-8 pr-10"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setOpen(true)}
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
        >
          <span className="sr-only">Search</span>
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) setResults([]);
        }}
      >
        <CommandInput
          placeholder="Search courses..."
          value={query}
          onValueChange={handleInputChange}
        />
        <CommandList className="min-h-[150px]">
          {isPending && query.length >= 3 ? (
            <SearchSkeleton />
          ) : query.length < 3 ? (
            <CommandItem
              disabled
              className="py-4 text-center text-muted-foreground"
            >
              Type at least 3 characters to search
            </CommandItem>
          ) : results.length === 0 ? (
            <CommandEmpty className="py-4">No courses found</CommandEmpty>
          ) : (
            <CommandGroup heading="Courses">
              {results.map((course) => (
                <CommandItem
                  key={course._id}
                  value={course.title}
                  onSelect={() => handleSelect(course.slug)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div className="bg-gray-100 border rounded-md w-10 h-10 flex items-center justify-center">
                    {course.title.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{course.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {course.category?.name}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
