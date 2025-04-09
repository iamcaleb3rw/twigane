"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Mock data - replace with your actual data
const subjects = [
  { value: "math", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English" },
  { value: "history", label: "History" },
  { value: "art", label: "Art" },
];

const grades = [
  { value: "1", label: "Grade 1" },
  { value: "2", label: "Grade 2" },
  { value: "3", label: "Grade 3" },
  { value: "4", label: "Grade 4" },
  { value: "5", label: "Grade 5" },
  { value: "6", label: "Grade 6" },
];

const sortOptions = [
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
];

export default function CourseFilters({
  currentSubject,
  currentGrade,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
}: {
  currentSubject: string;
  currentGrade: string;
  currentMinPrice: number;
  currentMaxPrice: number;
  currentSort: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openSubject, setOpenSubject] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentMinPrice,
    currentMaxPrice,
  ]);

  // Update URL with new search params
  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams();

      // Copy existing params
      searchParams.forEach((value, key) => {
        newSearchParams.set(key, value);
      });

      // Set page to 1 when filters change
      newSearchParams.set("page", "1");

      // Update search params based on the provided params object
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Apply filters
  const applyFilters = useCallback(() => {
    router.push(
      `${pathname}?${createQueryString({
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
      })}`
    );
  }, [pathname, router, createQueryString, priceRange]);

  // Handle subject selection
  const handleSubjectChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        subject: value === currentSubject ? null : value,
      })}`
    );
    setOpenSubject(false);
  };

  // Handle grade selection
  const handleGradeChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        grade: value === currentGrade ? null : value,
      })}`
    );
    setOpenGrade(false);
  };

  // Handle sort selection
  const handleSortChange = (value: string) => {
    router.push(
      `${pathname}?${createQueryString({
        sort: value,
      })}`
    );
  };

  // Reset all filters
  const resetFilters = () => {
    router.push(pathname);
    setPriceRange([0, 1000]);
    setOpenMobileFilters(false);
  };

  // Update price range when props change
  useEffect(() => {
    setPriceRange([currentMinPrice, currentMaxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  // Desktop filters
  const FiltersContent = () => (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Subject</h3>
            {currentSubject && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={() => handleSubjectChange(currentSubject)}
              >
                Clear
              </Button>
            )}
          </div>
          <Popover open={openSubject} onOpenChange={setOpenSubject}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSubject}
                className="w-full justify-between"
              >
                {currentSubject
                  ? subjects.find((subject) => subject.value === currentSubject)
                      ?.label
                  : "Select subject"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search subject..." />
                <CommandList>
                  <CommandEmpty>No subject found.</CommandEmpty>
                  <CommandGroup>
                    {subjects.map((subject) => (
                      <CommandItem
                        key={subject.value}
                        value={subject.value}
                        onSelect={handleSubjectChange}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentSubject === subject.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {subject.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Grade</h3>
            {currentGrade && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-xs text-muted-foreground"
                onClick={() => handleGradeChange(currentGrade)}
              >
                Clear
              </Button>
            )}
          </div>
          <Popover open={openGrade} onOpenChange={setOpenGrade}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openGrade}
                className="w-full justify-between"
              >
                {currentGrade
                  ? grades.find((grade) => grade.value === currentGrade)?.label
                  : "Select grade"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search grade..." />
                <CommandList>
                  <CommandEmpty>No grade found.</CommandEmpty>
                  <CommandGroup>
                    {grades.map((grade) => (
                      <CommandItem
                        key={grade.value}
                        value={grade.value}
                        onSelect={handleGradeChange}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            currentGrade === grade.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {grade.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Price Range</h3>
            <span className="text-xs text-muted-foreground">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
          </div>
          <Slider
            defaultValue={priceRange}
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            onValueCommit={applyFilters}
            className="py-4"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Sort By</h3>
          <RadioGroup
            value={currentSort}
            onValueChange={handleSortChange}
            className="space-y-1"
          >
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-sm">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator />

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop filters */}
      <Card className="hidden md:block sticky top-20 shadow-none">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <FiltersContent />
        </CardContent>
      </Card>

      {/* Mobile filters */}
      <div className="md:hidden">
        <Dialog open={openMobileFilters} onOpenChange={setOpenMobileFilters}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters & Sort
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filters & Sort</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto py-4">
              <FiltersContent />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
