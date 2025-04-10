import { books } from "@/lib/books";
import BooksPageClient from "@/components/BooksPageClient";
import { Suspense } from "react";
import { Metadata } from "next";
import MetadataImage from "@/public/Library.webp";

export default function BooksPage() {
  return (
    <Suspense
      fallback={<div className="p-4 text-center">Loading books...</div>}
    >
      <BooksPageClient />
    </Suspense>
  );
}
