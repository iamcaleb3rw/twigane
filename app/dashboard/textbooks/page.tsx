import { books } from "@/lib/books";
import BooksPageClient from "@/components/BooksPageClient";
import { Suspense } from "react";
import { Metadata } from "next";
import MetadataImage from "@/public/Library.webp";

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

  // Add filter-based keywords
  if (grade) keywordSet.add(`Grade ${grade}`);
  if (subject) keywordSet.add(subject);
  if (search) keywordSet.add(search);

  // Filter books based on criteria
  const filteredBooks = books.filter((book) => {
    const matchesGrade = grade ? book.grade === grade : true;
    const matchesSubject = subject ? book.subject === subject : true;
    const matchesSearch = search
      ? book.title.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesGrade && matchesSubject && matchesSearch;
  });

  // Add book-specific keywords
  filteredBooks.forEach((book) => {
    keywordSet.add(book.title);
    keywordSet.add(book.subject);
    keywordSet.add(`Grade ${book.grade}`);
    // Consider adding author names if available
  });

  return Array.from(keywordSet);
};

// Generate metadata dynamically
export async function generateMetadata({
  searchParams,
}: {
  searchParams: { grade?: string; subject?: string; search?: string };
}): Promise<Metadata> {
  const { grade, subject, search } = await Promise.resolve(searchParams);
  console.log(grade, subject, search);

  const keywords = getDynamicKeywords({ grade, subject, search });

  // Build title parts
  const titleParts = [
    subject,
    grade ? `Grade ${grade}` : null,
    search ? `"${search}"` : null,
    "Rwandan Curriculum Educational Books",
  ].filter(Boolean);

  const title =
    titleParts.length > 1
      ? `Explore ${titleParts.join(" - ")}`
      : titleParts[0] || "Rwandan Educational Books Library";

  // Build description
  const descriptionParts = [
    grade ? `Grade ${grade}` : null,
    subject ? `${subject} books` : null,
    search ? `Results for "${search}"` : null,
    "Discover a curated selection of Rwandan curriculum books by subject and grade.",
  ].filter(Boolean);

  const description = descriptionParts.join(" ");

  // Properly construct URL with search params
  const params = new URLSearchParams();
  if (grade) params.set("grade", grade);
  if (subject) params.set("subject", subject);
  if (search) params.set("search", search);

  const currentURL = `/dashboard/textbooks${params.toString() ? `?${params.toString()}` : ""}`;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined, // Only include if not empty
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
      images: [MetadataImage.src], // Twitter also needs explicit images
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
    <Suspense
      fallback={<div className="p-4 text-center">Loading books...</div>}
    >
      <BooksPageClient />
    </Suspense>
  );
}
