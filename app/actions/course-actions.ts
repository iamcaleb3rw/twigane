"use server";

import { getCourses } from "@/sanity/lib/courses/getCourses";
import getSidebarInfoById from "@/sanity/lib/courses/getSidebarInfoById";
import { searchCourses } from "@/sanity/lib/courses/searchCourses";
import { revalidatePath } from "next/cache";

// This is a mock implementation - replace with your actual data fetching logic
export async function fetchCourses({
  query = "",
  subject = "",
  grade = "",
  minPrice = 0,
  maxPrice = 10000,
  page = 1,
  pageSize = 9,
  sort = "title-asc",
}: {
  query?: string;
  subject?: string;
  grade?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  pageSize?: number;
  sort?: string;
}) {
  // In a real implementation, you would fetch from your database or API
  // This is just a mock that filters the data based on the parameters

  // Simulate API call delay

  // Get all courses (replace with your actual data fetching)
  const allCourses = await getCourses();

  // Filter courses based on query, subject, grade, and price
  let filteredCourses = allCourses.filter((course) => {
    const matchesQuery =
      !query ||
      course.title?.toLowerCase().includes(query.toLowerCase()) ||
      course.description?.toLowerCase().includes(query.toLowerCase());

    const matchesSubject =
      !subject ||
      course.category?.name?.toLowerCase() === subject.toLowerCase();

    const matchesGrade = !grade || course.grade === grade;

    const matchesPrice =
      !course.price || (course.price >= minPrice && course.price <= maxPrice);

    return matchesQuery && matchesSubject && matchesGrade && matchesPrice;
  });

  // Sort courses
  filteredCourses = sortCourses(filteredCourses, sort);

  // Calculate pagination
  const total = filteredCourses.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + pageSize
  );

  return {
    items: paginatedCourses,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Helper function to sort courses
function sortCourses(courses: any[], sort: string) {
  const [field, direction] = sort.split("-");

  return [...courses].sort((a, b) => {
    if (field === "title") {
      const titleA = a.title || "";
      const titleB = b.title || "";
      return direction === "asc"
        ? titleA.localeCompare(titleB)
        : titleB.localeCompare(titleA);
    }

    if (field === "price") {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      return direction === "asc" ? priceA - priceB : priceB - priceA;
    }

    if (field === "date") {
      const dateA = new Date(a._createdAt).getTime();
      const dateB = new Date(b._createdAt).getTime();
      return direction === "asc" ? dateA - dateB : dateB - dateA;
    }

    return 0;
  });
}

// Function to search courses - can be called from the search bar
export async function searchForCourses(query: string) {
  const results = await searchCourses(query);
  revalidatePath("/dashboard/courses");
  return results;
}

export async function getSidebarCourse(courseId: string) {
  const result = await getSidebarInfoById(courseId);
  return result;
}
