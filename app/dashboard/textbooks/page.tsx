import { books } from "@/lib/books";
import BooksPageClient from "@/components/BooksPageClient";
import { Suspense } from "react";
import { Metadata } from "next";
import MetadataImage from "@/public/Library.webp";
import { log } from "console";
// Import if needed for deeper inspection

// Helper to format keywords dynamically
const getDynamicKeywords = ({
  grade,
  subject,
  search,
}: {
  grade?: string;
  subject?: string;
  search?: string;
}) => {
  const keywordSet = new Set<string>();

  if (grade) keywordSet.add(`Grade ${grade}`);
  if (subject) keywordSet.add(subject);
  if (search) keywordSet.add(search);

  const filteredBooks = books.filter((book) => {
    const matchesGrade = grade ? book.grade === grade : true;
    const matchesSubject = subject ? book.subject === subject : true;
    const matchesSearch = search
      ? book.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesGrade && matchesSubject && matchesSearch;
  });

  filteredBooks.forEach((book) => {
    keywordSet.add(book.title);
    keywordSet.add(book.subject);
    keywordSet.add(`Grade ${book.grade}`);
  });

  return Array.from(keywordSet);
};

// Generate metadata dynamically
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { grade?: string; subject?: string; search?: string };
}): Promise<Metadata> {
  // Explicitly await the searchParams
  const resolvedSearchParams = await searchParams;

  const grade = resolvedSearchParams.grade;
  const subject = resolvedSearchParams.subject;
  const search = resolvedSearchParams.search;

  console.log(grade, subject, search);

  const keywords = getDynamicKeywords({ grade, subject, search });

  const titleParts = [
    subject,
    grade ? `${grade} books` : null,
    search ? `"${search}"` : null,
    "Rwandan Curriculum Educational Books",
  ].filter(Boolean);

  const title = `Explore ${titleParts.join(" - ")}`;
  const descriptionParts = [
    grade ? `${grade}` : null,
    subject ? `${subject} books` : null,
    search ? `Results for "${search}"` : null,
    "Discover a curated selection of Rwandan curriculum books by subject and grade.",
  ].filter(Boolean);
  const description = descriptionParts.join(" ");

  const currentSearchParamsString = resolvedSearchParams.toString();
  const currentURL = `/dashboard/textbooks${currentSearchParamsString ? `?${currentSearchParamsString}` : ""}`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: currentURL,
      type: "website",
      siteName: "Rwandan Educational Books Library",
      locale: "en_RW",
      images: [
        {
          url: MetadataImage.src,
          width: 600,
          height: 600,
          alt: "Rwandan Educational Books Library",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: currentURL,
    },
  };
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksPageClient />
    </Suspense>
  );
}
