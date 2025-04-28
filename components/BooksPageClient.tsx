"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { books, Book, Subject } from "@/lib/books";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  Calculator,
  FlaskConical,
  Atom,
  Bot,
} from "lucide-react";
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
import { BookComponent } from "./ui/book";

const uniqueGrades = [...new Set(books.map((book) => book.grade))];
const uniqueSubjects = [...new Set(books.map((book) => book.subject))];

const subjectColors: Record<
  Subject,
  { bg: string; text: string; icon: string }
> = {
  Mathematics: {
    bg: "#f97316",
    text: "text-purple-700",
    icon: "text-purple-500",
  },
  Physics: {
    bg: "#7c3aed",
    text: "text-blue-700",
    icon: "text-blue-500",
  },
  "Computer Science": {
    bg: "#e11d48",
    text: "text-blue-700",
    icon: "text-blue-500",
  },
  Chemistry: {
    bg: "#6366f1",
    text: "text-green-700",
    icon: "text-green-500",
  },
  Biology: {
    bg: "#ec4899",
    text: "text-red-700",
    icon: "text-red-500",
  },
};

const subjectIcons: Record<Subject, React.ReactNode> = {
  Mathematics: (
    <Calculator className="h-[70px] w-[70px] absolute top-[50%] right-0 opacity-20" />
  ),
  Physics: (
    <Atom className="h-[70px] w-[70px] absolute top-[50%] right-0 opacity-20" />
  ),
  Chemistry: (
    <FlaskConical className="h-[70px] w-[70px] absolute top-[50%] right-0 opacity-20" />
  ),
  Biology: (
    <Brain className="h-[70px] w-[70px] absolute top-[50%] right-0 opacity-20" />
  ),
  "Computer Science": (
    <Bot className="h-[70px] w-[70px] absolute top-[50%] right-0 opacity-20" />
  ),
};

const BOOKS_PER_PAGE = 9;

export default function BooksPageClient() {
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
    const params = new URLSearchParams();
    if (grade) params.set("grade", grade);
    if (subject) params.set("subject", subject);
    if (search) params.set("search", search);
    if (currentPage > 1) params.set("page", currentPage.toString());

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
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">📘 Books Library</h1>

      <Input
        placeholder="Search by title"
        className="md:w-1/2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Select
        value={grade}
        onValueChange={(value: string) => {
          setGrade(value);
          setCurrentPage(1);
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

      <div className="flex overflow-x-auto space-x-2 mt-4">
        <button
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-200 text-gray-700 cursor-pointer"
          onClick={handleAllBooksClick}
        >
          All Books
        </button>
        {uniqueSubjects.map((s) => {
          const isActive = subject === s;
          const colors = subjectColors[s];
          return (
            <button
              key={s}
              className={`flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer ${
                isActive
                  ? `bg-[${colors.bg}] s ${colors.text}`
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {
                setSubject(isActive ? undefined : s);
                setCurrentPage(1);
              }}
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedBooks.map((book, index) => {
          const colors = subjectColors[book.subject];
          return (
            <Link href={book.url} target="_blank" title={book.title}>
              <BookComponent
                depth={10}
                key={index}
                color={colors.bg}
                illustration={
                  <p className="m-3 font-bold text-white text-lg">
                    {book.title}
                  </p>
                }
              >
                <div className="p-3 mb-2 grid gap-3">
                  <h1 className="font-semibold">{book.grade}</h1>
                  <span className="">{subjectIcons[book.subject]}</span>
                </div>
              </BookComponent>
            </Link>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-muted-foreground">No books match the filters.</p>
      )}

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
  );
}
