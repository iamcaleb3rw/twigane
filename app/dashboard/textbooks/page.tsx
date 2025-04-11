// app/books/page.tsx
import { books } from "@/lib/books";
import BooksPageClient from "@/components/BooksPageClient";
import { Suspense } from "react";
import { Metadata } from "next";
import MetadataImage from "@/public/Library.webp";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const { grade, subject, search } = await searchParams;

  // Construct title parts based on filters
  const titleParts = [];
  if (grade) titleParts.push(`${grade}`);
  if (subject) titleParts.push(`${subject} Books`);
  if (search) titleParts.push(`Search results for '${search}'`);
  if (titleParts.length === 0) titleParts.push("All Books");
  const fullTitle = `${titleParts.join(" | ")} | Library`;

  // Build description based on active filters
  let description = "Explore our collection of educational books. ";
  if (search) description = `Search results for '${search}' in our library. `;

  const filterParts = [];
  if (grade) filterParts.push(`${grade}`);
  if (subject) filterParts.push(subject);
  if (filterParts.length > 0) {
    description += `Filtered by ${filterParts.join(" and ")}. `;
  }
  description += "Find the perfect resources for your learning journey.";

  // Construct canonical URL with filters
  const urlParams = new URLSearchParams();
  if (grade) urlParams.set("grade", grade.toString());
  if (subject) urlParams.set("subject", subject.toString());
  if (search) urlParams.set("search", search.toString());
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}/books?${urlParams.toString()}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      images: [
        {
          url: MetadataImage.src,
          width: MetadataImage.width,
          height: MetadataImage.height,
          alt: "Library Books Collection",
        },
      ],
      siteName: "Educational Library",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [MetadataImage.src],
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
