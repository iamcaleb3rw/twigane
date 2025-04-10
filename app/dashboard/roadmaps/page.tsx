import BooksPageClient from "@/components/BooksPageClient";
import { Suspense } from "react";

export default function BooksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BooksPageClient />
    </Suspense>
  );
}
