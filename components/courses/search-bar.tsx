"use client";

import type React from "react";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { searchCourses } from "@/app/actions/course-actions";
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

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  // Get the current query from URL when component mounts
  useEffect(() => {
    const currentQuery = searchParams.get("query") || "";
    setQuery(currentQuery);
  }, [searchParams]);

  // Handle search input change
  const handleSearch = (value: string) => {
    setQuery(value);

    if (value.length > 2) {
      startTransition(async () => {
        const searchResults = await searchCourses(value);
        setResults(searchResults);
      });
    } else {
      setResults([]);
    }
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);

    // Create new URL with search params
    const params = new URLSearchParams();
    // Copy existing params except query
    searchParams.forEach((value, key) => {
      if (key !== "query") {
        params.set(key, value);
      }
    });

    // Add query param if it exists
    if (query) {
      params.set("query", query);
    }

    // Reset to first page on new search
    params.set("page", "1");

    router.push(`/dashboard/courses?${params.toString()}`);
  };

  // Handle selecting a course from search results
  const handleSelect = (courseSlug: string) => {
    setOpen(false);
    router.push(`/dashboard/courses/${courseSlug}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search courses..."
          className="w-full pl-8 pr-10"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search courses..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Courses">
            {results.map((course) => (
              <CommandItem
                key={course._id}
                onSelect={() => handleSelect(course.slug)}
              >
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {course.category?.name} • Grade {course.grade}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
