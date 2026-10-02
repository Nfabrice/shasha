import { Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { daysUntil } from "@/lib/format";
import { getSubscriptionStatus } from "@/services/schools-service";
import type { ConnectionStatus, School } from "@/types/school";

export function ConnectionDot({ connection, className }: { connection: ConnectionStatus; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-2 w-2 shrink-0 rounded-full",
        connection === "Connected" ? "bg-connected" : "bg-not-connected",
        className,
      )}
    />
  );
}

export function ConnectionBadge({ connection, className }: { connection: ConnectionStatus; className?: string }) {
  const isConnected = connection === "Connected";
  const Icon = isConnected ? Wifi : WifiOff;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        isConnected ? "bg-connected-soft text-connected-dark" : "bg-not-connected-soft text-not-connected-dark",
        className,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {connection}
    </span>
  );
}

const SUBSCRIPTION_STYLES = {
  Active: "bg-emerald-50 text-emerald-700",
  "Expiring soon": "bg-amber-50 text-amber-700",
  Expired: "bg-slate-100 text-slate-600",
} as const;

/** Subscription state with the time left, e.g. "Expires in 4 days"; nothing when there is no data. */
export function SubscriptionBadge({ school, className }: { school: School; className?: string }) {
  const status = getSubscriptionStatus(school);
  if (!status) return <span className="text-[12px] font-semibold text-navy-900">—</span>;

  let label: string = status;
  if (status === "Expiring soon" && school.subscriptionEnd) {
    const days = daysUntil(school.subscriptionEnd);
    label = days === 0 ? "Expires today" : `Expires in ${days} day${days === 1 ? "" : "s"}`;
  }

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        SUBSCRIPTION_STYLES[status],
        className,
      )}
    >
      {label}
    </span>
  );
}
