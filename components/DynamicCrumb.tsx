"use client";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import Link from "next/link";

function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((segment) => segment);

  // Remove the first "dashboard" segment if present
  const filteredSegments =
    segments[0] === "dashboard" ? segments.slice(1) : segments;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Dashboard Root */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {filteredSegments.length > 0 && <BreadcrumbSeparator />}

        {/* Dynamic Breadcrumbs */}
        {filteredSegments.map((segment, index) => {
          const href =
            "/dashboard/" + filteredSegments.slice(0, index + 1).join("/");
          const isLast = index === filteredSegments.length - 1;
          const formattedSegment = decodeURIComponent(
            segment.replace(/-/g, " ")
          );

          return (
            <BreadcrumbItem key={href}>
              {isLast ? (
                <BreadcrumbPage className="capitalize">
                  {formattedSegment}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formattedSegment}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default DynamicBreadcrumbs;
