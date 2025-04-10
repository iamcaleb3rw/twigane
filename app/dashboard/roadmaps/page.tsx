import { Suspense } from "react";
import { Metadata } from "next";
import { books } from "@/lib/books";
import BooksPageClient from "@/components/BooksPageClient";

// Generate metadata for better SEO
export const metadata: Metadata = {
  title:
    "Explore Rwandan Curriculum Educational Books | Find Resources by Subject and Grade",
  description:
    "Discover a comprehensive collection of Rwandan curriculum educational books across Mathematics, Physics, Chemistry, Biology, and English. Filter by grade level and subject to find the perfect resources for your studies in Rwanda.",
  keywords: [
    "Rwandan curriculum books",
    "Rwanda textbooks",
    "Rwanda academic resources",
    "educational books",
    "mathematics books",
    "physics books",
    "chemistry books",
    "biology books",
    "english books",
    "study materials",
    "academic library",
    ...books.map((book) => book.title),
    ...Array.from(new Set(books.map((book) => book.subject))),
    ...Array.from(new Set(books.map((book) => book.grade))).map(
      (grade) => `grade ${grade}`
    ),
  ],
  openGraph: {
    title:
      "Explore Rwandan Curriculum Educational Books | Find Resources by Subject and Grade",
    description:
      "Access a wide range of Rwandan curriculum educational books and resources across multiple subjects and grade levels. Find the perfect study materials for your academic needs in Rwanda.",
    type: "website",
    siteName: "Rwandan Educational Books Library",
    locale: "en_RW", // Use the appropriate locale for Rwanda
    images: [
      {
        url: "https://example.com/path/to/image.jpg", // Replace with your image URL
        width: 800,
        height: 600,
        alt: "Rwandan Educational Books Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Explore Rwandan Curriculum Educational Books | Find Resources by Subject and Grade",
    description:
      "Discover a comprehensive collection of Rwandan curriculum educational books across various subjects. Filter by grade level and subject to find the perfect resources for your studies in Rwanda.",
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
    canonical: "/dashboard/roadmaps",
  },
};

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksPageClient />
    </Suspense>
  );
}
