import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function MapSkeleton() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <Skeleton className="h-full w-full rounded-2xl" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
        <p className="text-sm font-medium text-muted-foreground">Loading map…</p>
      </div>
    </div>
  );
}
