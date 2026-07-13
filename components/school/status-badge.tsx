import { cn } from "@/lib/utils";
import { STATUS_COLORS } from "@/lib/constants";
import type { SchoolStatus } from "@/types/school";

interface StatusBadgeProps {
  status: SchoolStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status];
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        colors.bg,
        colors.text,
        colors.border,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", status === "Active" ? "bg-emerald-500" : "bg-red-500")} />
      {status}
    </span>
  );
}
