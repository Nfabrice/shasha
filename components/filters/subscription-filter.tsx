"use client";

import { useDashboardStore } from "@/lib/store/dashboard-store";
import type { SubscriptionFilterValue } from "@/types/school";
import { ChipGroup } from "./chip-group";

const OPTIONS: { label: string; value: SubscriptionFilterValue }[] = [
  { label: "All", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
];

export function SubscriptionFilter() {
  const subscription = useDashboardStore((state) => state.filters.subscription);
  const setSubscription = useDashboardStore((state) => state.setSubscription);

  return <ChipGroup label="Subscription" value={subscription} options={OPTIONS} onChange={setSubscription} />;
}
