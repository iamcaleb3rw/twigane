import { Suspense } from "react";
import { redirect } from "next/navigation";
import { fetchCourses } from "@/app/actions/course-actions";
import CourseFilters from "@/components/courses/course-filters";
import CourseGrid from "@/components/courses/course-grid";
import CoursePagination from "@/components/courses/course-pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Await the searchParams before accessing its properties
  const resolvedParams = await searchParams;

  // Safely extract search parameters with proper type handling
  const query =
    typeof resolvedParams.query === "string" ? resolvedParams.query : "";
  const subject =
    typeof resolvedParams.subject === "string" ? resolvedParams.subject : "";
  const grade =
    typeof resolvedParams.grade === "string" ? resolvedParams.grade : "";
  const minPrice =
    typeof resolvedParams.minPrice === "string"
      ? Number.parseInt(resolvedParams.minPrice, 10)
      : 0;
  const maxPrice =
    typeof resolvedParams.maxPrice === "string"
      ? Number.parseInt(resolvedParams.maxPrice, 10)
      : 1000;
  const page =
    typeof resolvedParams.page === "string"
      ? Number.parseInt(resolvedParams.page, 10)
      : 1;
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : "title-asc";

  // Redirect if page is less than 1
  if (page < 1) {
    redirect("/dashboard/courses?page=1");
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <CourseFilters
            currentSubject={subject}
            currentGrade={grade}
            currentMinPrice={minPrice}
            currentMaxPrice={maxPrice}
            currentSort={sort}
          />
        </div>
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-sm text-muted-foreground">
              Showing results for: {query ? `"${query}"` : "All courses"}
              {subject ? ` in ${subject}` : ""}
              {grade ? ` for grade ${grade}` : ""}
            </p>
          </div>
          <Suspense fallback={<CourseGridSkeleton />}>
            <CourseList
              query={query}
              subject={subject}
              grade={grade}
              minPrice={minPrice}
              maxPrice={maxPrice}
              page={page}
              sort={sort}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function CourseList({
  query,
  subject,
  grade,
  minPrice,
  maxPrice,
  page,
  sort,
}: {
  query: string;
  subject: string;
  grade: string;
  minPrice: number;
  maxPrice: number;
  page: number;
  sort: string;
}) {
  const pageSize = 9;
  const courses = await fetchCourses({
    query,
    subject,
    grade,
    minPrice,
    maxPrice,
    page,
    pageSize,
    sort,
  });

  const totalPages = Math.ceil(courses.total / pageSize);

  if (courses.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <>
      <CourseGrid courses={courses.items} />
      <CoursePagination currentPage={page} totalPages={totalPages} />
    </>
  );
}

function CourseGridSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
