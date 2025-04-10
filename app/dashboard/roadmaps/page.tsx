"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { books, Book, Subject } from "@/lib/books";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, Calculator, FlaskConical, Atom } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const uniqueGrades = [...new Set(books.map((book) => book.grade))];
const uniqueSubjects = [...new Set(books.map((book) => book.subject))];

// Color configurations for subjects
const subjectColors: Record<
  Subject,
  { bg: string; text: string; icon: string }
> = {
  Mathematics: {
    bg: "bg-purple-500/20",
    text: "text-purple-700",
    icon: "text-purple-500",
  },
  Physics: {
    bg: "bg-blue-500/50",
    text: "text-blue-700",
    icon: "text-blue-500",
  },
  Chemistry: {
    bg: "bg-green-500/50",
    text: "text-green-700",
    icon: "text-green-500",
  },
  Biology: {
    bg: "bg-red-500/50",
    text: "text-red-700",
    icon: "text-red-500",
  },
  English: {
    bg: "bg-yellow-500/50",
    text: "text-yellow-700",
    icon: "text-yellow-500",
  },
};

const subjectIcons: Record<Subject, React.ReactNode> = {
  Mathematics: <Calculator className="w-4 h-4" />,
  Physics: <Atom className="w-4 h-4" />,
  Chemistry: <FlaskConical className="w-4 h-4" />,
  Biology: <Brain className="w-4 h-4" />,
  English: <BookOpen className="w-4 h-4" />,
};

const BOOKS_PER_PAGE = 6; // Set the number of books per page

export default function BooksPage() {
  const searchParams = useSearchParams();
  const [grade, setGrade] = useState<string | undefined>(
    searchParams.get("grade") || undefined
  );
  const [subject, setSubject] = useState<string | undefined>(
    searchParams.get("subject") || undefined
  );
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1")
  );

  useEffect(() => {
    // Update the URL when filters change
    const params = new URLSearchParams();
    if (grade) params.set("grade", grade);
    if (subject) params.set("subject", subject);
    if (search) params.set("search", search);
    if (currentPage > 1) params.set("page", currentPage.toString());

    // Update the URL without refreshing the page
    window.history.replaceState({}, "", `?${params.toString()}`);
  }, [grade, subject, search, currentPage]);

  const filteredBooks = books.filter((book) => {
    const matchesGrade = grade ? book.grade === grade : true;
    const matchesSubject = subject ? book.subject === subject : true;
    const matchesSearch = book.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesGrade && matchesSubject && matchesSearch;
  });

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * BOOKS_PER_PAGE,
    currentPage * BOOKS_PER_PAGE
  );

  const handleAllBooksClick = () => {
    setGrade(undefined);
    setSubject(undefined);
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <Suspense>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">📘 Books Library</h1>

        {/* Search Input */}
        <Input
          placeholder="Search by title"
          className="md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* All Books Badge */}
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 cursor-pointer"
          onClick={handleAllBooksClick}
        >
          All Books
        </button>

        {/* Grade Select */}
        <Select
          onValueChange={(value: string) => {
            setGrade(value);
            setCurrentPage(1); // Reset to the first page when changing filters
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Grade" />
          </SelectTrigger>
          <SelectContent>
            {uniqueGrades.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Subject Badges in Horizontal Scroll */}
        <div className="flex overflow-x-auto space-x-2 mt-4">
          {uniqueSubjects.map((s) => {
            const isActive = subject === s;
            const colors = subjectColors[s];
            return (
              <button
                key={s}
                className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer ${
                  isActive
                    ? `${colors.bg} ${colors.text}`
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => {
                  setSubject(isActive ? undefined : s);
                  setCurrentPage(1); // Reset to the first page when changing filters
                }}
              >
                <span className={colors.icon}>{subjectIcons[s]}</span>
                {s}
              </button>
            );
          })}
        </div>

        {/* Book Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedBooks.map((book, index) => {
            const colors = subjectColors[book.subject];
            return (
              <Card key={index}>
                <CardContent className="p-4 space-y-2">
                  <h2 className="font-semibold text-lg">{book.title}</h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span
                      className={`${colors.bg} ${colors.text} flex items-center gap-2 px-2 py-1 rounded-full`}
                    >
                      <span className={colors.icon}>
                        {subjectIcons[book.subject]}
                      </span>
                      {book.subject}
                    </span>
                    · {book.grade}
                  </p>
                  <Link
                    href={book.url}
                    target="_blank"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Book →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <p className="text-muted-foreground">No books match the filters.</p>
        )}

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === index + 1}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </Suspense>
  );
}
