import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="space-y-3">
      <Skeleton className="h-[400px] aspect-video flex items-center justify-center">
        <p>Loading faster than your crush replies 😅</p>
      </Skeleton>
      <Skeleton className="h-6" />
    </div>
  );
}
