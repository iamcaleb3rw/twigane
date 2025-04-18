import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-[250px] w-full" />
      <Skeleton className="h-6 w-[300px] mt-3 mb-1" />
      <hr />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-3">
        <Skeleton className="min-h-[350px] w-full" />
        <Skeleton className="min-h-[350px] w-full" />
        <Skeleton className="min-h-[350px] w-full" />
      </div>
    </div>
  );
}
